/**
 * @original author
 * Francieli Boito
 */
import java.io.IOException;

import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.api.java.function.PairFunction;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaDoubleRDD;
import org.apache.spark.util.StatCounter;
import org.apache.spark.sql.SparkSession;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.TextOutputFormat;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;

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


public class SparkSequenceFileExample {
	public static void main(String[] args) throws Exception {
	        //spark initialization part
		SparkConf conf = new SparkConf().setAppName("Spark_SeqFile_example");
		JavaSparkContext sc = new JavaSparkContext(conf);
		sc.setLogLevel("ERROR"); //to see less messages from spark in the output
		SparkSession spark = new SparkSession(JavaSparkContext.toSparkContext(sc)); //if we want to work with dataframes
	    //read the input sequence file into an RDD
	    JavaPairRDD<LongWritable,TweetWritable> inputfile = sc.sequenceFile("/user/fzanonboito/filtered_tweets/part*", LongWritable.class, TweetWritable.class); //here the types match what was used when writing the sequence file
        //we need to do two things: first we need to copy data from each element of the rdd produced by sequenceFile because it reuses the same Writable objects when reading
        //second we need to change the types because spark does not like the Hadoop Writable classes, it does not know how to serialize them.
        //here I just took the String field inside TweetWritable. Alternatively we could write our own Serializable class.
		JavaRDD<Tuple2<Long, String>> parsed = inputfile.map( 
			(x) -> {
				if (! x._2.hashtags.isEmpty())
					new Tuple2<Long, String> (new Long(x._1.get()), x._2.hashtags[0]);
			}	
		);
       	//print one tweet (just to test it)
        String a_tweet = parsed.take(5).get(0)._2;
        System.out.println(a_tweet);
	}
}
