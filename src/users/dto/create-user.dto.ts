import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export const PROFILE_TYPES = ['default', 'dev', 'design', 'science'] as const;
export const VIEW_MODES = ['list', 'timeline'] as const;

export class CreateUserDto {
  @ApiProperty({ example: '홍길동', description: 'CV 소유자 이름' })
  @IsString()
  name: string = '홍길동';

  @ApiPropertyOptional({ example: '백엔드 개발자 · 오픈소스 기여자' })
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiPropertyOptional({ example: '문제를 코드로 풀어내는 것을 좋아합니다.' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'honggildong@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'github.com/honggildong' })
  @IsOptional()
  @IsString()
  github?: string;

  @ApiPropertyOptional({ enum: PROFILE_TYPES, example: 'dev' })
  @IsOptional()
  @IsIn(PROFILE_TYPES)
  profileType?: string = 'dev';

  @ApiPropertyOptional({ enum: VIEW_MODES, example: 'list' })
  @IsOptional()
  @IsIn(VIEW_MODES)
  viewMode?: string = 'list';

  @ApiPropertyOptional({ example: true, description: '공유 링크 공개 여부' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = true;
}
