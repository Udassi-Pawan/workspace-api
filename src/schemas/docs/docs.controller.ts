import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DocsService } from './docs.service';
import mongoose from 'mongoose';

@Controller('doc')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Post('update')
  async updateDoc(
    @Body('text') text: any,
    @Body('groupId') groupId: mongoose.Schema.Types.ObjectId,
    @Body('name') name: string,
  ) {
    const doc = await this.docsService.findDoc(`${groupId} ${name}`);
    console.log('requested doc', doc);
    if (!doc) {
      return this.docsService.createDoc(groupId, name, text);
    } else return this.docsService.updateDoc(groupId, name, text);
  }

  @Get('single/:name')
  async getSingleDoc(@Param('name') name) {
    console.log('reqdoc', name, await this.docsService.findDoc(name));
    return await this.docsService.findDoc(name);
  }
}
