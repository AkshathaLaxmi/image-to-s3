'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.geturl = async (event, context, callback) => {
    return await getUploadUrl(event);
}

const getUploadUrl = async function(event) {
    const randomID = parseInt(Math.random() * 10000000);
    const dims = event.pathParameters.dims;
    const dimsArray = dims.split("&");

    var widthArr = dimsArray[0];
    var heightArr = dimsArray[1];
    
    widthArr = widthArr.split("=");
    heightArr = heightArr.split("=");

    var width = '';
    var height = '';

    if (widthArr.length == 2) {
        width = widthArr[1];
    } else {
        width = null;
    }

    if (heightArr.length == 2) {
        height = heightArr[1];
    } else {
        height = null;
    }

    // if (width == 'width') {
    //     width = '';
    //     // height = parseInt(height);
    // } else if (height == 'height') {
    //     height = '';
    //     // width = parseInt(width);
    // } else {
    //     // width = parseInt(width);
    //     width = width;
    //     // height = parseInt(height);
    //     height = height;
    // }

    const Key = `${randomID}_${width}-${height}.jpg`;
    const params = {
        Bucket: process.env.UploadBucket,
        Key,
        Expires: 3000,
        ContentType: 'image/jpg',
        ACL: 'public-read-write'
    };
    console.log('Params: ', params);
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    const resizeKey = `resized-${Key}`;
    const imageURL = `https://${process.env.ResizeBucket}.s3.${process.env.AwsRegion}.amazonaws.com/${resizeKey}`;
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            uploadURL: uploadUrl,
            Key,
            imageURL: imageURL
        })
    };

    return response;
}
