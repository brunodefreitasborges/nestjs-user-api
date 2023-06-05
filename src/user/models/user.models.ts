import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserRequest {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
  profilePicture: string;
}

export class UserResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profilePicture: string;
  };
  token: string;
}

export class LoginRequest {
  @IsNotEmpty()
  email: string;
  @MinLength(6)
  password: string;
}

export class PasswordReset {
  @MinLength(6)
  password: string;
}
