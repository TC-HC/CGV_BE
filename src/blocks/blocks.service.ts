import { Injectable } from '@nestjs/common';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { BlockType } from '../../generated/prisma';

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
      }
    })
  }

  findAll() {
    return `This action returns all blocks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} block`;
  }

  update(id: number, updateBlockDto: UpdateBlockDto) {
    return `This action updates a #${id} block`;
  }

  remove(id: number) {
    return `This action removes a #${id} block`;
  }
}
