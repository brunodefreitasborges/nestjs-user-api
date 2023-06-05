import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import {
  LoginRequest,
  PasswordReset,
  UserRequest,
  UserResponse,
} from '../models/user.models';
import * as jwt from 'jsonwebtoken';
import { MailerService } from '@nestjs-modules/mailer';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async login(body: LoginRequest): Promise<UserResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword && user.emailConfirmed) {
        // Create the signed JWT using the user's id and role
        const token = jwt.sign(
          { id: user.id, role: user.role },
          this.configService.get<string>('SECRET_KEY'),
        );
        const response = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
          },
          token: token,
        };
        return response;
      } else {
        throw new HttpException(
          'Credenciais inválidas',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException('Credenciais inválidas', HttpStatus.BAD_REQUEST);
    }
  }

  async registerUser(body: UserRequest): Promise<string> {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const confirmationToken = randomUUID();
    try {
      await this.prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
          profilePicture: body.profilePicture,
          confirmationToken: confirmationToken,
          passwordResetToken: '',
        },
      });
    } catch (error) {
      throw new HttpException('Este email já existe', HttpStatus.BAD_REQUEST);
    }

    // Send confirmation email
    const mail = {
      to: body.email,
      from: 'noreply@application.com',
      subject: 'Email de confirmação',
      template: 'email-confirmation',
      context: {
        token: confirmationToken,
      },
    };
    await this.mailerService.sendMail(mail);

    return 'Usuário criado com sucesso. Verifique seu e-mail.';
  }

  async confirmEmail(token: string): Promise<string> {
    const updated = await this.prisma.user.updateMany({
      where: {
        confirmationToken: token,
      },
      data: {
        confirmationToken: '',
        emailConfirmed: true,
      },
    });
    if (updated.count == 0) {
      throw new HttpException('Token inválido', HttpStatus.BAD_REQUEST);
    } else {
      return 'Email confirmado com sucesso';
    }
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      const passwordResetToken = randomUUID();
      await this.prisma.user.updateMany({
        where: {
          email: email,
        },
        data: {
          passwordResetToken: passwordResetToken,
        },
      });
      // Send confirmation email
      const mail = {
        to: email,
        from: 'noreply@application.com',
        subject: 'Email de recuperação de senha',
        template: 'password-reset',
        context: {
          token: passwordResetToken,
        },
      };
      await this.mailerService.sendMail(mail);
      return 'Email para redefição de senha enviado.';
    } else {
      throw new HttpException('Email não encontrado', HttpStatus.BAD_REQUEST);
    }
  }

  async resetPassword(token: string, body: PasswordReset): Promise<string> {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const updated = await this.prisma.user.updateMany({
      where: {
        passwordResetToken: token,
      },
      data: {
        passwordResetToken: '',
        password: hashedPassword,
      },
    });

    if (updated.count == 0) {
      throw new HttpException('Token inválido', HttpStatus.BAD_REQUEST);
    } else {
      return 'Senha redefinada com sucesso';
    }
  }

  async updateUser(id: string, body: UserRequest): Promise<void> {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    try {
      await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
          profilePicture: body.profilePicture,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
