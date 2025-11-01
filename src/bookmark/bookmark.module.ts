import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [BookmarkController],
  providers: [BookmarkService, PrismaService], 
  imports: [AuthModule]
})
export class BookmarkModule {}
