import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { MoveBlockDto } from './dto/move-block.dto';
import { ReorderBlocksDto } from './dto/reorder-blocks.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertSection(sectionId: number) {
    const section = await this.prisma.section.findUnique({ where: { id: sectionId } });
    if (!section) {
      throw new NotFoundException(`존재하지 않는 섹션입니다. (ID: ${sectionId})`);
    }
    return section;
  }

  async create(sectionId: number, createBlockDto: CreateBlockDto) {
    await this.assertSection(sectionId);
    const order =
      createBlockDto.order ??
      (await this.prisma.block.count({
        where: { sectionId },
      }));

    return this.prisma.$transaction(async (tx) => {
      await tx.block.updateMany({
        where: {
          sectionId,
          order: { gte: order },
        },
        data: { order: { increment: 1 } },
      });

      return tx.block.create({
        data: {
          ...createBlockDto,
          order,
          sectionId,
        },
      });
    });
  }

  findAll(sectionId?: number) {
    return this.prisma.block.findMany({
      where: sectionId ? { sectionId } : undefined,
      orderBy: [{ sectionId: 'asc' }, { order: 'asc' }],
    });
  }

  async findOne(id: number) {
    const block = await this.prisma.block.findUnique({
      where: { id },
    });

    if (!block) {
      throw new NotFoundException(`존재하지 않는 블록입니다. (ID: ${id})`);
    }

    return block;
  }

  async update(id: number, updateBlockDto: UpdateBlockDto) {
    await this.findOne(id);
    return this.prisma.block.update({
      where: { id },
      data: updateBlockDto,
    });
  }

  async move(id: number, moveBlockDto: MoveBlockDto) {
    const block = await this.findOne(id);
    const targetSectionId = moveBlockDto.targetSectionId ?? block.sectionId;
    await this.assertSection(targetSectionId);

    return this.prisma.$transaction(async (tx) => {
      await tx.block.updateMany({
        where: {
          sectionId: block.sectionId,
          order: { gt: block.order },
        },
        data: { order: { decrement: 1 } },
      });

      const targetCount = await tx.block.count({
        where: {
          sectionId: targetSectionId,
          id: { not: id },
        },
      });
      const targetOrder = Math.min(moveBlockDto.order ?? targetCount, targetCount);

      await tx.block.updateMany({
        where: {
          sectionId: targetSectionId,
          id: { not: id },
          order: { gte: targetOrder },
        },
        data: { order: { increment: 1 } },
      });

      return tx.block.update({
        where: { id },
        data: {
          sectionId: targetSectionId,
          order: targetOrder,
        },
      });
    });
  }

  async reorder(sectionId: number, reorderBlocksDto: ReorderBlocksDto) {
    await this.assertSection(sectionId);
    const blocks = await this.prisma.block.findMany({
      where: { sectionId },
      select: { id: true },
    });
    const existingIds = blocks.map((block) => block.id).sort((a, b) => a - b);
    const requestedIds = [...reorderBlocksDto.blockIds].sort((a, b) => a - b);

    if (
      existingIds.length !== requestedIds.length ||
      existingIds.some((id, index) => id !== requestedIds[index])
    ) {
      throw new BadRequestException('해당 섹션의 모든 블록 ID를 정확히 한 번씩 전달해야 합니다.');
    }

    await this.prisma.$transaction(
      reorderBlocksDto.blockIds.map((blockId, order) =>
        this.prisma.block.update({
          where: { id: blockId },
          data: { order },
        }),
      ),
    );

    return this.findAll(sectionId);
  }

  async remove(id: number) {
    const block = await this.findOne(id);
    const deleted = await this.prisma.block.delete({
      where: { id },
    });

    await this.prisma.block.updateMany({
      where: {
        sectionId: block.sectionId,
        order: { gt: block.order },
      },
      data: { order: { decrement: 1 } },
    });

    return deleted;
  }
}
