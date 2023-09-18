import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { S3Service } from './s3.service';

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
}
