import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.S3_REGION,
    signatureVersion: 'v4',
  });
  async getPresignedUploadUrl(filetype: string, fileId: string) {
    const ex = filetype.split('/')[1];
    const Key = `${fileId}.${ex}`;
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key,
      Expires: 60 * 3,
      ContentType: filetype,
    };
    const uploadUrl = await this.s3.getSignedUrl('putObject', s3Params);
    return { uploadUrl, Key };
  }

  async getPresignedDownloadUrl(filename: string, originalFilename) {
    console.log('originalFilename', originalFilename);
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      ResponseContentDisposition: `attachment; filename="${originalFilename}"`,

      Expires: 60 * 3,
    };
    return await this.s3.getSignedUrl('getObject', s3Params);
  }
}
