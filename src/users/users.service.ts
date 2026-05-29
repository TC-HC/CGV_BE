import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly profileInclude = {
    sections: {
      orderBy: { order: 'asc' as const },
      include: {
        blocks: {
          orderBy: { order: 'asc' as const },
        },
      },
    },
  };

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      include: this.profileInclude,
    });
  }

  createDemo() {
    return this.prisma.user.create({
      data: {
        name: '홍길동',
        tagline: '백엔드 개발자 · 오픈소스 기여자',
        bio: '문제를 코드로 풀어내는 것을 좋아합니다. 사람들이 더 편하게 경험을 기록할 수 있도록 만들고 싶습니다.',
        email: 'honggildong@example.com',
        github: 'github.com/honggildong',
        profileType: 'dev',
        viewMode: 'list',
        sections: {
          create: [
            {
              title: '대외 활동',
              category: '개발',
              order: 0,
              blocks: {
                create: [
                  {
                    type: 'activity',
                    title: 'Infoteam 롱커톤 참여',
                    period: '2024.03 - 2024.12',
                    role: '운영진 / 백엔드',
                    summary: '전국 대학생 IT 창업 동아리에서 백엔드 개발 및 운영 담당',
                    detail: 'Django REST Framework 기반 API 서버 설계, 팀원 멘토링 진행',
                    order: 0,
                  },
                  {
                    type: 'achievement',
                    title: 'GDSC 해커톤 최우수상',
                    result: '1위 (최우수상)',
                    date: '2024.06',
                    certLink: 'https://example.com',
                    summary: '24시간 해커톤에서 교내 쓰레기 분리배출 앱 개발 수상',
                    order: 1,
                  },
                ],
              },
            },
            {
              title: '프로젝트',
              category: '개발',
              order: 1,
              blocks: {
                create: [
                  {
                    type: 'project',
                    title: 'CV Block 플랫폼',
                    stack: 'React · NestJS · PostgreSQL',
                    role: '프론트엔드 개발',
                    link: 'https://github.com',
                    summary: '이력서를 블록 단위로 구성하는 플랫폼 개발',
                    order: 0,
                  },
                ],
              },
            },
            {
              title: '학습 기록',
              category: '기타',
              order: 2,
              blocks: {
                create: [
                  {
                    type: 'learning',
                    title: 'CS50 - Harvard 온라인 강의',
                    contentType: '강의',
                    summary: 'C, Python, SQL 등 컴퓨터과학 기초 전반 학습 완료',
                    order: 0,
                  },
                ],
              },
            },
          ],
        },
      },
      include: this.profileInclude,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
      include: this.profileInclude,
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: this.profileInclude,
    });

    if (!user) {
      throw new NotFoundException(`존재하지 않는 유저입니다. (ID: ${id})`);
    }

    return user;
  }

  async findPublicByShareSlug(shareSlug: string) {
    const user = await this.prisma.user.findUnique({
      where: { shareSlug },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            blocks: {
              where: { isPublic: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!user || !user.isPublic) {
      throw new NotFoundException('공개된 CV를 찾을 수 없습니다.');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: this.profileInclude,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
