import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { LoginRequest, UserRequest } from '../models/user.models';
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

  async login(body: LoginRequest): Promise<string> {
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
        return token;
      } else {
        return 'Invalid credentials';
      }
    } catch (error) {
      return 'Invalid credentials';
    }
  }

  async registerUser(body: UserRequest): Promise<string> {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const confirmationToken = randomUUID();
    await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        profilePicture: body.profilePicture,
        confirmationToken: confirmationToken,
      },
    });
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
    await this.prisma.user.updateMany({
      where: {
        confirmationToken: token,
      },
      data: {
        confirmationToken: undefined,
        emailConfirmed: true,
      },
    });

    return 'Email confirmado com sucesso';
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
