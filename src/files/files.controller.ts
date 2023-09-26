import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/schemas/users/users.service';
import { S3Service } from 'src/s3/s3.service';
import { GroupsRepository } from 'src/schemas/groups/groups.repository';
import { UsersRepository } from 'src/schemas/users/users.repository';

class Request {
  user: any;
}

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
    private readonly groupsRepository: GroupsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async createFile(
    @Req() req: Request,
    @Body('filetype') filetype: string,
    @Body('name') name: string,
    @Body('groups') groups: [string],
  ) {
    console.log('create request');
    const userFromDb = await this.usersService.getUser(req.user.email);

    const curFile = await this.filesService.createFile(
      filetype,
      name,
      userFromDb._id,
    );
    this.usersRepository.findOneAndUpdate(
      { _id: userFromDb._id },
      { $push: { files: curFile._id } },
    );
    groups.forEach(async (g) => {
      await this.groupsRepository.findOneAndUpdate(
        { _id: g },
        { $push: { files: curFile._id } },
      );
    });
    return await this.s3Service.getPresignedUploadUrl(filetype, curFile._id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('download')
  async downloadFile(
    @Req() req: Request,
    @Body('filename') filename: string,
    @Body('originalFilename') originalFilename: string,
  ) {
    const url = this.s3Service.getPresignedDownloadUrl(
      filename,
      originalFilename,
    );
    console.log(url);
    return url;
  }
}
