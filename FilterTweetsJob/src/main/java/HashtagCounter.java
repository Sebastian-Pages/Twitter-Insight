package bigdata;

import java.io.IOException;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.PairFunction;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaDoubleRDD;
import org.apache.spark.util.StatCounter;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;
import sun.security.krb5.Config;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.HColumnDescriptor;
import org.apache.hadoop.hbase.HTableDescriptor;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.Admin;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.apache.hadoop.hbase.client.HBaseAdmin;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Table;
import org.apache.hadoop.hbase.util.Bytes;
import org.apache.hadoop.hbase.io.ImmutableBytesWritable;
import org.apache.hadoop.hbase.mapreduce.TableOutputFormat;
import org.apache.hadoop.hbase.mapreduce.TableInputFormat;

import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;


import java.util.Arrays;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.Iterator;

import java.nio.charset.Charset;


import scala.Tuple2;


public class HashtagCounter {
    public static final byte[] CITY_FAMILY = Bytes.toBytes("hashtag");
    public static final byte[] POP_FAMILY = Bytes.toBytes("count");
    public static final String TABLE_NAME = "ypages:hashtagcount1"; //IL FAUT CHANGER LE NAMESPACE!
    //get a line of the input file and transform it into a pair (city, population)
	public static Tuple2<String,String> parseString(String s) {
			String [] parsed = s.split(",");
			Tuple2<String, String> ret = new Tuple2(parsed[1], parsed[4]);
			return ret;
	}
    public static void createTable(Connection connect) {
			try {
				final Admin admin = connect.getAdmin();
                //create a table with two column families: city and population
				HTableDescriptor tableDescriptor = new HTableDescriptor(TableName.valueOf(TABLE_NAME));
				tableDescriptor.addFamily(new HColumnDescriptor(CITY_FAMILY));
				tableDescriptor.addFamily(new HColumnDescriptor(POP_FAMILY));
			    if (admin.tableExists(tableDescriptor.getTableName())) {
				    admin.disableTable(tableDescriptor.getTableName());
    				admin.deleteTable(tableDescriptor.getTableName());
	    		}
		    	admin.createTable(tableDescriptor);
				admin.close();
			} catch (Exception e) {
				e.printStackTrace();
				System.exit(-1);
			}
    }
    //get a tuple (city name, population) and prepare the corresponding tuple
    //that will become a row in the hbase table
    public static Tuple2<ImmutableBytesWritable, Put> prepareForHbase(Tuple2<String,String> x) {
        //the first element of the tuple, the city name, will be the key for the row
        //that could be a problem for cities with the same name.
        //However, this is just an example, we don't care.
        //We could use zipWithIndex to add an index to each element of the RDD,
        //that index could be used as a key (and would really be unique).
        Put put = new Put(Bytes.toBytes(x._1()));
        //we'll add two columns for this line, city:name (name is the name of the
        //column, city is the family) and population:total
        put.addColumn(CITY_FAMILY, Bytes.toBytes("name"), Bytes.toBytes(x._1()));
        put.addColumn(POP_FAMILY, Bytes.toBytes("total"), Bytes.toBytes(x._2()));
        return new Tuple2<ImmutableBytesWritable, Put>(new ImmutableBytesWritable(), put);
    }
	public static void main(String[] args) throws Exception {
        //hbase initialization part
        Configuration conf_hbase = HBaseConfiguration.create();
		conf_hbase.set("hbase.mapred.outputtable", TABLE_NAME);
		conf_hbase.set("mapreduce.outputformat.class", "org.apache.hadoop.hbase.mapreduce.TableOutputFormat");
		conf_hbase.set("mapreduce.output.fileoutputformat.outputdir", "/tmp");
		Connection connection = ConnectionFactory.createConnection(conf_hbase);
        //spark initialization part
		SparkConf conf = new SparkConf().setAppName("Spark_HBase_example");
		JavaSparkContext sc = new JavaSparkContext(conf);
        //read the input file and transform it into an RDD of (city, population)
        JavaRDD<String> inputfile = sc.textFile("/user/auber/data_ple/worldcitiespop.txt").filter(x -> !x.contains("Country,City"));
        JavaRDD<Tuple2<String,String>> pop = inputfile.map(x-> parseString(x)).filter(x -> !x._2.equals(""));
        JavaPairRDD<String, String> citiespop = JavaPairRDD.fromJavaRDD(pop);
        //create the hbase table where we'll write this
        createTable(connection);
        //prepare the data for hbase
        JavaPairRDD<ImmutableBytesWritable, Put> hbaserdd = citiespop.mapToPair(x -> prepareForHbase(x));
        //send it to hbase
        Job newAPIJob = Job.getInstance(conf_hbase);
        hbaserdd.saveAsNewAPIHadoopDataset(newAPIJob.getConfiguration());
        System.out.println("saved to hbase\n");

	}
}
