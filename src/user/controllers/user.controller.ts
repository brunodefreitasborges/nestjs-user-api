import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { LoginRequest, UserRequest, UserResponse } from '../models/user.models';
import { UserService } from '../services/user.service';
import { AdminGuard } from '../guards/admin.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login(@Body() body: LoginRequest): Promise<string> {
    return await this.userService.login(body);
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userService.getAllUsers();
    return users.map((user) => {
      const userResponse: UserResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password,
        createdAt: user.createdAt,
        profilePicture: user.profilePicture,
      };
      return userResponse;
    });
  }

  @Post()
  async registerUser(@Body() body: UserRequest): Promise<void> {
    this.userService.registerUser(body);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() body: UserRequest,
  ): Promise<void> {
    this.userService.updateUser(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteUser(@Param('id') id: string): Promise<void> {
    this.userService.deleteUser(id);
  }
}
