import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class ReorderBlocksDto {
  @ApiProperty({ example: [3, 1, 2], description: '해당 섹션에 속한 모든 블록 ID를 원하는 순서대로 전달합니다.' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  blockIds: number[] = [];
}
