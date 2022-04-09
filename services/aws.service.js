const AWS = require('aws-sdk');
const fs = require('fs');

const validBucket = new AWS.S3({
    accessKeyId: process.env.VALID_S3_BUCKET_KEY_ID,
    secretAccessKey: process.env.VALID_S3_BUCKET_SECERET_KEY,
});

const invalidBucket = new AWS.S3({
    accessKeyId: process.env.INVALID_S3_BUCKET_KEY_ID,
    secretAccessKey: process.env.INVALID_S3_BUCKET_SECERET_KEY,
});



async function uploadFile(fileName, isValid) {
    const bucket = isValid ? validBucket : invalidBucket;   
    const file = fs.readFileSync(`${process.cwd()}/filesUploads/${fileName}`, 'utf8');
    return new Promise((resolve, reject) => {
        bucket.upload({ 
            Bucket: isValid ? process.env.VALID_S3_BUCKET_NAME : process.env.INVALID_S3_BUCKET_NAME,
            Key: fileName,
            Body: file
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = uploadFile;
