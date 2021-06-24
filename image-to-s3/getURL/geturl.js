'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.geturl = async (event, context, callback) => {
    return await getUploadUrl(event);
}

const getUploadUrl = async function(event) {
    const randomID = parseInt(Math.random() * 10000000);
    const Key = `${randomID}.jpg`;
    const params = {
        Bucket: process.env.UploadBucket,
        Key,
        Expires: 300,
        ContentType: 'image/jpg'
    };
    console.log('Params: ', params);
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
            uploadURL: uploadUrl,
            Key,
        })
    };

    return response;
}
