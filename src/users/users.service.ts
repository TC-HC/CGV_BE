import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service'
import { User } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto : CreateUserDto){
    return {};
  }

  async remove(id: number){
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: any) {
    console.log('');
    return {id}
  }

  async findOne(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        name: username,
      },
    });
  }

  async findAll(){
    return {};
  }
}
