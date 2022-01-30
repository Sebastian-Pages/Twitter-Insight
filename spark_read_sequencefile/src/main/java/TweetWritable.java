/**
 * @original author
 * Sophie Stan & Deborah Perreira
 * @modified by
 * David Auber
 */

import org.apache.hadoop.io.Writable;
import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;
import static org.apache.hadoop.io.WritableUtils.*;

public class TweetWritable implements Writable, Cloneable {
    long id;
    long timestamp;
    String text;
    String userName;
    int followersCount;
    boolean isRT;
    int retweetCount;
    String[] hashtags;

    public TweetWritable() {
    }

    public TweetWritable(long id, long timestamp, String text, String userName, int followersCount,
                         boolean isRT, int retweetCount, String[] hashtags) {
        this.id = id;
        this.timestamp = timestamp;
        this.text = text;
        this.userName = userName;
        this.followersCount = followersCount;
        this.isRT = isRT;
        this.retweetCount = retweetCount;
        this.hashtags = hashtags;
    }

    public TweetWritable(TweetWritable other) {
	this.id = other.id;
	this.timestamp = other.timestamp;
        this.text = other.text;
        this.userName = other.userName;
        this.followersCount = other.followersCount;
        this.isRT = other.isRT;
        this.retweetCount = other.retweetCount;
        this.hashtags = other.hashtags;
    }

    @Override
    public TweetWritable clone() {
        TweetWritable tmp = null;
        try{
            tmp = (TweetWritable) super.clone();
            tmp.hashtags = hashtags.clone();
        }
        catch(Exception e) {}
        return tmp;
    }

    @Override
    public void readFields(DataInput in) throws IOException {
        id = in.readLong();
        timestamp = in.readLong();
        text = readString(in);
        userName = readString(in);
        followersCount = in.readInt();
        isRT = in.readBoolean();
        retweetCount = in.readInt();
        hashtags = readStringArray(in);
    }

    @Override
    public void write(DataOutput out) throws IOException {
        out.writeLong(id);
        out.writeLong(timestamp);
        writeString(out, text);
        writeString(out, userName);
        out.writeInt(followersCount);
        out.writeBoolean(isRT);
        out.writeInt(retweetCount);
        writeStringArray(out, hashtags);
    }
}
