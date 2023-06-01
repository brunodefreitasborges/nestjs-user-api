import { Injectable } from '@nestjs/common';
import { Room } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CustomRequest } from '../models/custom-request';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async getRooms(): Promise<Room[]> {
    return this.prisma.room.findMany();
  }

  async createRoom(body: Room, request: CustomRequest): Promise<void> {
    const ownerId = request.user.id;
    const participants = [ownerId]; // Owner is the initial participant

    await this.prisma.room.create({
      data: {
        name: body.name,
        ownerId,
        participants: {
          connect: participants.map((participantId) => ({ id: participantId })),
        },
      },
    });
  }

  async joinRoom(id: string, request: CustomRequest): Promise<void> {
    const userId = request.user.id;
    try {
      await this.prisma.room.update({
        where: {
          id: Number(id),
        },
        data: {
          participants: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async leaveRoom(id: string, request: CustomRequest): Promise<void> {
    const userId = request.user.id;
    try {
      await this.prisma.room.update({
        where: {
          id: Number(id),
        },
        data: {
          participants: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
