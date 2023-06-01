import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserRequest {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  role: string;
  @MinLength(6)
  password: string;
  profilePicture: string;
}

export class UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
  createdAt: Date;
  profilePicture: string;
}

export class LoginRequest {
  @IsNotEmpty()
  email: string;
  @MinLength(6)
  password: string;
}
