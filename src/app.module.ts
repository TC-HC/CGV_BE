import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BlocksModule } from './blocks/blocks.module';
import { PrismaModule } from '../prisma/prisma.module'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, BlocksModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
