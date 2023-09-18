import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { UsersModule } from 'src/schemas/users/users.module';
import { FilesRepository } from './files.repository';
import { GroupsModule } from 'src/schemas/groups/groups.module';
import { S3Module } from 'src/s3/s3.module';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FilesSchema } from './files.schema';

@Module({
  controllers: [FilesController],
  providers: [FilesService, FilesRepository],
  imports: [
    UsersModule,
    GroupsModule,
    S3Module,
    MongooseModule.forFeature([{ name: File.name, schema: FilesSchema }]),
  ],
})
export class FilesModule {}
