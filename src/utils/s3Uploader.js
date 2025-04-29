import aws from 'aws-sdk'
import {v4 as uuid} from 'uuid';

const s3 = new AWS.S3({region: process.env.AWS_REGION})

const