import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { LoginRequest, UserRequest } from '../models/user.models';
import { UserService } from '../services/user.service';
import { AdminGuard } from '../guards/admin.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login(@Body() body: LoginRequest): Promise<string> {
    return await this.userService.login(body);
  }

  @Post()
  async registerUser(@Body() body: UserRequest): Promise<string> {
    return this.userService.registerUser(body);
  }

  @Get('email-confirmation')
  async confirmEmail(@Param('token') token: string): Promise<string> {
    return this.userService.confirmEmail(token);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() body: UserRequest,
  ): Promise<void> {
    this.userService.updateUser(id, body);
  }
}
