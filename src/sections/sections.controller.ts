import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReorderBlocksDto } from '../blocks/dto/reorder-blocks.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionsService } from './sections.service';

@ApiTags('sections')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get()
  @ApiOperation({
    summary: '섹션 목록 조회',
    description: '전체 섹션 또는 특정 유저의 섹션을 블록 포함 형태로 조회합니다.',
  })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  findAll(@Query('userId') userId?: string) {
    return this.sectionsService.findAll(userId ? Number(userId) : undefined);
  }

  @Post('users/:userId')
  @ApiOperation({
    summary: '유저 CV에 섹션 생성',
    description: 'FE의 섹션 추가 기능에 대응합니다.',
  })
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createSectionDto: CreateSectionDto,
  ) {
    return this.sectionsService.create(userId, createSectionDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '섹션 단건 조회' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sectionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '섹션 이름/카테고리/순서 수정' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionsService.update(id, updateSectionDto);
  }

  @Patch('users/:userId/reorder')
  @ApiOperation({
    summary: '섹션 순서 일괄 변경',
    description: 'FE에서 섹션 자체를 드래그해 CV 스토리 순서를 바꿀 때 사용합니다.',
  })
  reorder(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() reorderSectionsDto: ReorderSectionsDto,
  ) {
    return this.sectionsService.reorder(userId, reorderSectionsDto);
  }

  @Patch(':id/blocks/reorder')
  @ApiOperation({
    summary: '섹션 내부 블록 순서 일괄 변경',
    description: '같은 섹션 안에서 Drag & Drop 순서 변경 후 blockIds를 원하는 순서대로 보냅니다.',
  })
  reorderBlocks(
    @Param('id', ParseIntPipe) id: number,
    @Body() reorderBlocksDto: ReorderBlocksDto,
  ) {
    return this.sectionsService.reorderBlocks(id, reorderBlocksDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '섹션 삭제' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sectionsService.remove(id);
  }
}
