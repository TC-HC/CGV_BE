import { IsString, IsNumber, IsEnum, IsOptional, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BlockType } from '@prisma/client';

export class CreateBaseBlockDto {
    @ApiProperty({ description: "The type of the block", enum: BlockType })
    @IsEnum(BlockType)
    type: BlockType = "Project";

    @ApiProperty({ description: "The order of the block" })
    @IsNumber()
    order: number = 1;
}

export class CreateActiveBlockDto {
    @ApiProperty({ description: "The title of the activity"})
    @IsString()
    title: string = "New Activity";

    @ApiProperty({ description: "The role of the activity" })
    @IsString()
    role: string = "New Role";

    @ApiProperty({ "description": "The period of the activity" })
    @IsString()
    period: string = "0000/00/00 - 0000/00/00"

    @ApiProperty({ "description": "The details of the activity" })
    @IsString()
    detail: string = "Detail text..."

    @ApiProperty({ "description": "Link that can prove the activity"})
    @IsUrl()
    proofLink: string | undefined = "http://..."
}

export class CreateAchievementBlockDto {
    @ApiProperty({ description: "The title of the achievement" })
    @IsString()
    title: string = "New Project";

    @ApiProperty({ description: "The role of the achievement" })
    @IsString()
    role: string = "New Role";

    @ApiProperty({ description: "The date of achievement" })
    @IsString()
    date: string = "0000/00/00"

    @ApiProperty({ description: "The details of the achievement" })
    @IsString()
    detail: string = "Detail text..."
}

export class CreateProjectBlockDto {
    @ApiProperty({ description: "The title of the project" })
    @IsString()
    title: string = "New Project";

    @ApiProperty({ description: "The role of the project" })
    @IsString()
    role: string = "New Role";

    @ApiProperty({ description: "The period of the project" })
    @IsString()
    period: string = "0000/00/00 - 0000/00/00"

    @ApiProperty({ description: "The details of the project" })
    @IsString()
    detail: string = "Detail text..."
}

export class CreateLearningBlockDto {
    @ApiProperty({ description: "The title of the learning" })
    @IsString()
    title: string = "New Learning";

    @ApiProperty({ description: "The role of the learning" })
    @IsString()
    role: string = "New Role";

    @ApiProperty({ description: "The subject of the class"})
    @IsString()
    class: string = "New Class";

    @ApiProperty({ description: "The class of the learning" })
    @IsString()
    period: string = "Course/Study Group/Research Paper/etc..."

    @ApiProperty({ description: "The details of the learning" })
    @IsString()
    detail: string = "Detail text..."
}

export class CreateBlockDto extends CreateBaseBlockDto {
    @ApiProperty({ description: 'Activity block data', type: CreateActiveBlockDto, required: false} )
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateActiveBlockDto)
    activity?: CreateActiveBlockDto;

    @ApiProperty({ description: 'Achievement block data', type: CreateAchievementBlockDto, required: false} )
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateAchievementBlockDto)
    achievement?: CreateAchievementBlockDto;

    @ApiProperty({ description: 'Project block data', type: CreateProjectBlockDto, required: false} )
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateProjectBlockDto)
    project?: CreateProjectBlockDto;

    @ApiProperty({ description: 'Learning block data', type: CreateLearningBlockDto, required: false} )
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateLearningBlockDto)
    learning?: CreateLearningBlockDto;
}