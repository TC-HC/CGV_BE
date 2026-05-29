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
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { MoveBlockDto } from './dto/move-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@ApiTags('blocks')
@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get()
  @ApiOperation({
    summary: '블록 목록 조회',
    description: '전체 블록 또는 특정 섹션의 블록을 FE 표시 순서대로 조회합니다.',
  })
  @ApiQuery({ name: 'sectionId', required: false, type: Number })
  findAll(@Query('sectionId') sectionId?: string) {
    return this.blocksService.findAll(sectionId ? Number(sectionId) : undefined);
  }

  @Post('sections/:sectionId')
  @ApiOperation({
    summary: '섹션에 새 블록 생성',
    description: 'FE의 AddBlockModal 값과 동일한 평평한 block payload를 저장합니다.',
  })
  create(
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Body() createBlockDto: CreateBlockDto,
  ) {
    return this.blocksService.create(sectionId, createBlockDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '블록 단건 조회' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blocksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '블록 내용 수정',
    description: '활동/성과/프로젝트/학습 블록의 공통 필드와 타입별 선택 필드를 수정합니다.',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBlockDto: UpdateBlockDto) {
    return this.blocksService.update(id, updateBlockDto);
  }

  @Patch(':id/move')
  @ApiOperation({
    summary: '블록 이동',
    description: '같은 섹션 안 순서 변경 또는 다른 섹션으로 이동하여 상위 요소에 재할당합니다.',
  })
  move(@Param('id', ParseIntPipe) id: number, @Body() moveBlockDto: MoveBlockDto) {
    return this.blocksService.move(id, moveBlockDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '블록 삭제' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blocksService.remove(id);
  }
}
