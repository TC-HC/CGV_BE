import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BlocksModule } from './blocks/blocks.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SectionsModule } from './sections/sections.module';

@Module({
  imports: [UsersModule, SectionsModule, BlocksModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
