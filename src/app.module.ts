import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoomsModule } from './rooms/rooms.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './common/config/mailer.config';

@Module({
  imports: [UserModule, RoomsModule, MailerModule.forRoot(mailerConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
