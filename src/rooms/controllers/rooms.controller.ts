import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Room } from '@prisma/client';
import { RoomsService } from '../services/rooms.service';
import { UserGuard } from '../guards/user.guard';
import { CustomRequest } from '../models/custom-request';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Get()
  async getRooms(): Promise<Room[]> {
    return this.roomsService.getRooms();
  }

  @Post()
  @UseGuards(UserGuard)
  async createRoom(
    @Req() request: CustomRequest,
    @Body() body: Room,
  ): Promise<void> {
    this.roomsService.createRoom(body, request);
  }

  @Patch('join/:id')
  @UseGuards(UserGuard)
  async joinRoom(
    @Req() request: CustomRequest,
    @Param('id') id: string,
  ): Promise<void> {
    this.roomsService.joinRoom(id, request);
  }

  @Patch('leave/:id')
  @UseGuards(UserGuard)
  async leaveRoom(
    @Req() request: CustomRequest,
    @Param('id') id: string,
  ): Promise<void> {
    this.roomsService.leaveRoom(id, request);
  }
}
