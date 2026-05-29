import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class MoveBlockDto {
  @ApiPropertyOptional({ example: 2, description: '이동할 대상 섹션 ID. 생략하면 현재 섹션 안에서만 이동합니다.' })
  @IsOptional()
  @IsInt()
  @Min(1)
  targetSectionId?: number;

  @ApiPropertyOptional({ example: 0, description: '대상 섹션 안에서 들어갈 위치. 생략하면 맨 뒤로 이동합니다.' })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
