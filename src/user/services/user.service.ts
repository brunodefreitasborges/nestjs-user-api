import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { LoginRequest, UserRequest } from '../models/user.models';
import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async login(body: LoginRequest): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword) {
        // Create the signed JWT using the user's id and role
        const token = jwt.sign(
          { id: user.id, role: user.role },
          this.configService.get<string>('SECRET_KEY'),
        );
        return token;
      } else {
        return 'Invalid credentials';
      }
    } catch (error) {
      return 'Invalid credentials';
    }
  }

  async registerUser(body: UserRequest): Promise<void> {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
        password: hashedPassword,
        profilePicture: body.profilePicture,
      },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async updateUser(id: string, body: UserRequest): Promise<void> {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    try {
      await this.prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          name: body.name,
          email: body.email,
          role: body.role,
          password: hashedPassword,
          profilePicture: body.profilePicture,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
