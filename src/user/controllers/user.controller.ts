import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  LoginRequest,
  PasswordReset,
  UserRequest,
  UserResponse,
} from '../models/user.models';
import { UserService } from '../services/user.service';
import { AdminGuard } from '../guards/admin.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login(@Body() body: LoginRequest): Promise<UserResponse> {
    return await this.userService.login(body);
  }

  @Post()
  async registerUser(@Body() body: UserRequest): Promise<string> {
    return this.userService.registerUser(body);
  }

  @Get('email-confirmation')
  async confirmEmail(@Query('token') token: string): Promise<string> {
    return this.userService.confirmEmail(token);
  }

  @Get('forgot-password')
  async forgotPassword(@Query('email') email: string): Promise<string> {
    return this.userService.forgotPassword(email);
  }

  @Patch('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() body: PasswordReset,
  ) {
    return this.userService.resetPassword(token, body);
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
