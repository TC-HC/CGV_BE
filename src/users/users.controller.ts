import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'CV 프로필 생성',
    description: '이름, 소개, 분야 타입, 공유 공개 여부 등 FE 프로필 헤더 정보를 생성합니다.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('demo')
  @ApiOperation({
    summary: 'FE 목데이터와 같은 데모 CV 생성',
    description: '프론트 시연용 기본 프로필, 섹션, 블록을 한 번에 만듭니다.',
  })
  createDemo() {
    return this.usersService.createDemo();
  }

  @Get()
  @ApiOperation({ summary: 'CV 프로필 전체 조회' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('share/:shareSlug')
  @ApiOperation({
    summary: '공유 링크용 공개 CV 조회',
    description: '유저의 shareSlug로 공개 CV를 조회하며, 비공개 블록은 제외합니다.',
  })
  findPublicByShareSlug(@Param('shareSlug') shareSlug: string) {
    return this.usersService.findPublicByShareSlug(shareSlug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'CV 프로필 단건 조회' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'CV 프로필 수정',
    description: '프로필 헤더, 디자인 타입, 리스트/타임라인 보기 모드, 공유 공개 여부를 수정합니다.',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'CV 프로필 삭제' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
