'use strict';

const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3 = new AWS.S3();

exports.resize = async (event, context, callback) => {
    const srcBucket = event.Records[0].s3.bucket.name;
    console.log("Source bucket: ", srcBucket);
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const dstBucket = process.env.ResizeBucket;
    const dstKey = "resized-" + srcKey;

    var dims = srcKey.split("_")[1];
    dims = dims.split(".")[0];
    const dimsArray = dims.split("-");

    console.log("Dimensions: ", dimsArray);

    var width = '';
    var height = '';

    
    width = parseInt(dimsArray[0]);
    height = parseInt(dimsArray[1]);

    console.log("Height: ", height);
    console.log("Width: ", width);

    try {
        const params = {
            Bucket: srcBucket,
            Key: srcKey
        };
        var origimage = await s3.getObject(params).promise();
    } catch (error) {
        console.log(error);
        return;
    }

    try {
        if (Number.isNaN(width)) {
            var buffer = await sharp(origimage.Body).resize({height: height}).toBuffer();
        } else if (Number.isNaN(height)) {
            var buffer = await sharp(origimage.Body).resize({width: width}).toBuffer();
        } else {
            var buffer = await sharp(origimage.Body).resize({width: width, height: height}).toBuffer();
        }
    } catch (error) {
        console.log(error);
        return;
    }

    try {
        const dstParams = {
            Bucket: dstBucket,
            Key: dstKey,
            Body: buffer,
            ContentType: "image",
            ACL: 'public-read-write'
        };
        const putResult = await s3.putObject(dstParams).promise();
    } catch (error) {
        console.log(error);
        return;
    }
    console.log("SUccessfully resized " + srcBucket + '/' + srcKey +
    ' and uploaded to ' + dstBucket + '/' + dstKey);
};
