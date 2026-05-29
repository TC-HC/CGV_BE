import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReorderBlocksDto } from '../blocks/dto/reorder-blocks.dto';
import { BlocksService } from '../blocks/blocks.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blocksService: BlocksService,
  ) {}

  private readonly sectionInclude = {
    blocks: {
      orderBy: { order: 'asc' as const },
    },
  };

  private async assertUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`존재하지 않는 유저입니다. (ID: ${userId})`);
    }
    return user;
  }

  async create(userId: number, createSectionDto: CreateSectionDto) {
    await this.assertUser(userId);
    const order =
      createSectionDto.order ??
      (await this.prisma.section.count({
        where: { userId },
      }));

    return this.prisma.$transaction(async (tx) => {
      await tx.section.updateMany({
        where: {
          userId,
          order: { gte: order },
        },
        data: { order: { increment: 1 } },
      });

      return tx.section.create({
        data: {
          title: createSectionDto.title,
          category: createSectionDto.category ?? '기타',
          order,
          userId,
        },
        include: this.sectionInclude,
      });
    });
  }

  findAll(userId?: number) {
    return this.prisma.section.findMany({
      where: userId ? { userId } : undefined,
      orderBy: [{ userId: 'asc' }, { order: 'asc' }],
      include: this.sectionInclude,
    });
  }

  async findOne(id: number) {
    const section = await this.prisma.section.findUnique({
      where: { id },
      include: this.sectionInclude,
    });

    if (!section) {
      throw new NotFoundException(`존재하지 않는 섹션입니다. (ID: ${id})`);
    }

    return section;
  }

  async update(id: number, updateSectionDto: UpdateSectionDto) {
    await this.findOne(id);
    return this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
      include: this.sectionInclude,
    });
  }

  async reorder(userId: number, reorderSectionsDto: ReorderSectionsDto) {
    await this.assertUser(userId);
    const sections = await this.prisma.section.findMany({
      where: { userId },
      select: { id: true },
    });
    const existingIds = sections.map((section) => section.id).sort((a, b) => a - b);
    const requestedIds = [...reorderSectionsDto.sectionIds].sort((a, b) => a - b);

    if (
      existingIds.length !== requestedIds.length ||
      existingIds.some((id, index) => id !== requestedIds[index])
    ) {
      throw new BadRequestException('해당 유저의 모든 섹션 ID를 정확히 한 번씩 전달해야 합니다.');
    }

    await this.prisma.$transaction(
      reorderSectionsDto.sectionIds.map((sectionId, order) =>
        this.prisma.section.update({
          where: { id: sectionId },
          data: { order },
        }),
      ),
    );

    return this.findAll(userId);
  }

  reorderBlocks(sectionId: number, reorderBlocksDto: ReorderBlocksDto) {
    return this.blocksService.reorder(sectionId, reorderBlocksDto);
  }

  async remove(id: number) {
    const section = await this.findOne(id);
    const deleted = await this.prisma.section.delete({
      where: { id },
    });

    await this.prisma.section.updateMany({
      where: {
        userId: section.userId,
        order: { gt: section.order },
      },
      data: { order: { decrement: 1 } },
    });

    return deleted;
  }
}
