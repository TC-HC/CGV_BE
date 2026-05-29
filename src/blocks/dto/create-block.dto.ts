import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export const BLOCK_TYPES = ['activity', 'achievement', 'project', 'learning'] as const;
export const LEARNING_CONTENT_TYPES = ['강의', '스터디', '논문', '기타'] as const;

export class CreateBlockDto {
  @ApiProperty({ enum: BLOCK_TYPES, example: 'project', description: 'FE block.type 값' })
  @IsIn(BLOCK_TYPES)
  type: string = 'project';

  @ApiPropertyOptional({ example: 0, description: '섹션 안에서의 표시 순서. 생략하면 맨 뒤에 추가됩니다.' })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiProperty({ example: 'CV Block 플랫폼' })
  @IsString()
  title: string = '새 블록';

  @ApiPropertyOptional({ example: '2024.03 - 2024.12' })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiPropertyOptional({ example: '백엔드 개발' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ example: '이력서를 블록 단위로 구성하는 플랫폼 개발' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ example: 'NestJS와 Prisma 기반 API 서버 설계' })
  @IsOptional()
  @IsString()
  detail?: string;

  @ApiPropertyOptional({ example: '1위 (최우수상)' })
  @IsOptional()
  @IsString()
  result?: string;

  @ApiPropertyOptional({ example: '2024.06' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: 'https://example.com/certificate' })
  @IsOptional()
  @IsUrl()
  certLink?: string;

  @ApiPropertyOptional({ example: 'https://example.com/certificate.png' })
  @IsOptional()
  @IsUrl()
  certImageUrl?: string;

  @ApiPropertyOptional({ example: 'React · NestJS · PostgreSQL' })
  @IsOptional()
  @IsString()
  stack?: string;

  @ApiPropertyOptional({ example: 'https://github.com/example/cgv' })
  @IsOptional()
  @IsUrl()
  link?: string;

  @ApiPropertyOptional({ enum: LEARNING_CONTENT_TYPES, example: '강의' })
  @IsOptional()
  @IsIn(LEARNING_CONTENT_TYPES)
  contentType?: string;

  @ApiPropertyOptional({ example: '💻', description: '블록별 커스텀 이모지. 생략하면 FE가 type 기본값을 사용합니다.' })
  @IsOptional()
  @IsString()
  emoji?: string;

  @ApiPropertyOptional({ example: true, description: '공유 프로필에서 노출할지 여부' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = true;
}
