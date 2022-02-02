# Twitter-Insight
A BigData project for university to monitor large amounts of tweets

# Commands for the Project

### Conection
ssh -X ypages@147.210.117.54
kinit

### Web
/usr/local/bin/reset_firefox.sh 
firefox &
http://lsd-prod-namenode-0.lsd.novalocal:8080/ypages:t1/0
curl -X GET -H "Accept: application/json" --negotiate -u: "http://lsd-prod-namenode-0.lsd.novalocal:8080/ypages:t1/0"

npm install
npm run dev

### Jalon 1
from /FilterTweetsJob
    mvn package
    yarn jar target/Projet-Tweeter-1.0.jar /user/auber/data_ple/tweets/tweet_01_03_2020.nljson filtered_tweets/

    HADOOP_CLASSPATH=`hadoop classpath`:`hbase classpath` yarn jar target/Projet-Tweeter-1.0.jar /user/auber/data_ple/tweets/tweet_01_03_2020.nljson filtered_tweets/

### Jalon 2
from /SparkSequenceFileExample
    mvn package 
    spark-submit --master yarn --num-executors 4 --executor-memory 512M --total-executor-cores 2 target/SparkSequenceFileExample-0.0.1.jar

    --deploy-mode cluster

SparkSequenceFileExemple

HADOOP_CLASSPATH=`hadoop classpath`:`hbase classpath` spark-submit [options] [fichier jar]export 

### HBASE 
HADOOP_CLASSPATH=`hadoop classpath`:`hbase mapredcp`:/etc/hbase/conf:/usr/hdp/3.0.0.0-1634/hbase/lib/*
hbase shell
list ?