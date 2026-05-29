import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt } from 'class-validator';

export class ReorderSectionsDto {
  @ApiProperty({ example: [2, 1, 3], description: '해당 유저의 모든 섹션 ID를 원하는 순서대로 전달합니다.' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  sectionIds: number[] = [];
}
