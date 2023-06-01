import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RoomsController } from './controllers/rooms.controller';
import { RoomsService } from './services/rooms.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [RoomsController],
  providers: [PrismaService, RoomsService],
})
export class RoomsModule {}
