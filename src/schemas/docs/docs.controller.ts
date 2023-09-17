import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DocsService } from './docs.service';
import mongoose from 'mongoose';

@Controller('doc')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Post('update')
  async updateDoc(
    @Body('text') text: any,
    @Body('docId') docId: mongoose.Schema.Types.ObjectId,
  ) {
    const doc = await this.docsService.findDoc(docId);
    console.log('requested doc', doc);
    if (doc) {
      return this.docsService.updateDoc(docId, text);
    } else return 'doc does not exist';
  }

  @Post('create')
  async createDoc(
    @Body('groupId') groupId: mongoose.Schema.Types.ObjectId,
    @Body('name') name: string,
  ) {
    return this.docsService.createDoc(groupId, name);
  }

  @Get('single/:docId')
  async getSingleDoc(@Param('docId') docId: mongoose.Schema.Types.ObjectId) {
    console.log('reqdoc', docId, await this.docsService.findDoc(docId));
    return await this.docsService.findDoc(docId);
  }
}
