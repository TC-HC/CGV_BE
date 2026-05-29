import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ example: '프로젝트' })
  @IsString()
  title: string = '새 섹션';

  @ApiPropertyOptional({ example: '개발', description: 'FE 카테고리 필터 값' })
  @IsOptional()
  @IsString()
  category?: string = '기타';

  @ApiPropertyOptional({ example: 0, description: '프로필 안에서의 섹션 순서. 생략하면 맨 뒤에 추가됩니다.' })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
