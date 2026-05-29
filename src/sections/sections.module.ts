import { Module } from '@nestjs/common';
import { BlocksService } from '../blocks/blocks.service';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';

@Module({
  controllers: [SectionsController],
  providers: [SectionsService, BlocksService],
})
export class SectionsModule {}
