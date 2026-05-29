import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('blocks')
@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  @ApiOperation({
    summary: '새로운 블록 생성',
    description: '유저의 포트폴리오에 새로운 블록을 추가, 타입에 맞는 서브 데이터를 함께 보내야 함'
  })
  create(@Body() createBlockDto: CreateBlockDto) {
    const UserID = 1;
    return this.blocksService.create(UserID, createBlockDto);
  }

  @Get()
  @ApiOperation({
    summary: '포트폴리오 블록 탐색(ALL)',
    description: 'UserID를 바탕으로 유저의 포트폴리오에 있는 모든 파일을 불러옵니다.'
  })
  @ApiResponse({ status: 200, description: '블록 리스트 반환 성공'})
  findAll() {
    const UserID = 1;
    return this.blocksService.findAll(UserID);
  }

  @Get(':id')
  @ApiOperation({
    summary: '포트폴리오 탐색(One)',
    description: 'Block 고유의 id를 이용하여 block을 찾습니다.'
  })
  @ApiResponse({ status: 200, description: '단일 블록 조회 성공'})
  @ApiResponse({ status: 400, description: 'id 파라미터가 number가 아님'})
  @ApiResponse({ status: 404, description: '해당 id를 가진 블록이 존재하지 않음'})
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blocksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '블록 업데이트',
    description: "블록 고유의 id와 다른 정보를 받아 블록의 정보를 갱신합니다."
  })
  @ApiResponse({ status: 200, description: '블록 수정 성공'})
  @ApiResponse({ status: 404, description: '갱신하고자 하는 블록이 존재하지 않음'})
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBlockDto: UpdateBlockDto) {
    return this.blocksService.update(id, updateBlockDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '블록 삭제',
    description: "블록 고유의 id로 블록을 삭제합니다."
  })
  @ApiResponse({ status: 200, description: '블록 삭제 성공'})
  @ApiResponse({ status: 404, description: '삭제하려는 블록이 존재하지 않음'})
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blocksService.remove(id);
  }
}
