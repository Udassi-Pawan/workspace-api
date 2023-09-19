import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { S3Service } from './s3.service';
import { randomUUID } from 'crypto';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3service: S3Service) {}

  @Get('download')
  downloadFile(
    @Body('filename') filename: string,
    @Body('originalFilename') originalFilename: string,
  ) {
    return this.s3service.getPresignedDownloadUrl(filename);
  }

  @Post('upload')
  async uploadFile(@Body('filetype') filetype: string) {
    const videoId = randomUUID();
    const { uploadUrl } = await this.s3service.getPresignedUploadUrl(
      filetype,
      videoId,
    );
    const ex = filetype.split('/')[1];

    return { uploadUrl, videoId: videoId + '.' + ex };
  }
}
