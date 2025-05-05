const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
dotenv.config();

const bucket = process.env.AWS_BUCKET_NAME;
const cloudfrontUrl = process.env.AWS_CLOUDFRONT_URL;
const awsFileDir = process.env.AWS_FILE_DIR;

const s3 = new S3Client({
    region: process.env.AWS_REGION,
});

function sanitize(str) {s
    return str.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
}

async function uploadToS3(file) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn('⚠️ Skipping uploadToS3 in Development Mode.');
        return null;
    }

    const key = `${awsFileDir}/${Date.now()}-${sanitize(file.originalname)}`;

    const params = {
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: 'public-read', // Use only if your bucket allows public access
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return `https://${cloudfrontUrl}/${key}`;
}

module.exports = { uploadToS3 };