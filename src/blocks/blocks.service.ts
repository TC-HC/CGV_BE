import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { BlockType } from '@prisma/client';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(userID: number, createBlockDto: CreateBlockDto) {
    const { type, order, activity, achievement, project, learning } = createBlockDto;

    return this.prisma.block.create({
      data: {
        userID: userID,
        type,
        order,
        ...(type === BlockType.Activity && activity && { activity: { create: activity }}),
        ...(type === BlockType.Achievement && achievement && { achievement: { create: achievement }}),
        ...(type === BlockType.Project && project && { project: {create: project}}),
        ...(type === BlockType.Learning && learning && { learning: {create: learning}}),
      },
      include: {
        activity: true,
        achievement: true,
        project: true,
        learning: true,
      },
    });
  }

  async findAll(userID: number) {
    return this.prisma.block.findMany({
      where: { userID: userID },
      orderBy: { order: 'asc' },
      include: {
        activity: true,
        achievement: true,
        project: true,
        learning: true,
      },
    });
  }

  async findOne(id: number) {
    const block = await this.prisma.block.findUnique({
      where: { id },
      include: {
        activity: true,
        achievement: true,
        project: true,
        learning: true,
      },
    });

    if(!block) {
      throw new NotFoundException('존재하지 않는 블록입니다. (ID: ${id})');
    }
    return block;
  }

  async update(id: number, updateBlockDto: UpdateBlockDto) {
    const exBlock = await this.findOne(id);
    const { type, order, activity, achievement, project, learning } = updateBlockDto;

    return this.prisma.block.update({
      where: { id },
      data: {
        order,
        ...(type === BlockType.Activity && activity && { activity: { create: activity } }),
        ...(type === BlockType.Achievement && achievement && { achievement: { create: achievement } }),
        ...(type === BlockType.Project && project && { project: {create: project}}),
        ...(type === BlockType.Learning && learning && { learning: {create: learning}}),
      },
      include: {
        activity: true,
        achievement: true,
        project: true,
        learning: true,
      },
    });

  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.block.delete({
      where: { id },
    });
  }
}
