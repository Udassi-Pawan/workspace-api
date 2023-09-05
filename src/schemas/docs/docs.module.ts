import { Module, forwardRef } from '@nestjs/common';
import { DocsController } from './docs.controller';
import { DocsRepository } from './docs.repository';
import { DocsService } from './docs.service';
import { GroupsModule } from '../groups/groups.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Doc, DocsSchema } from './docs.schema';

@Module({
  imports: [
    forwardRef(() => GroupsModule),
    MongooseModule.forFeature([{ name: Doc.name, schema: DocsSchema }]),
  ],
  controllers: [DocsController],
  providers: [DocsService, DocsRepository],
  exports: [],
})
export class DocsModule {}
