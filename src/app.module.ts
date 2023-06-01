import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [UserModule, RoomsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
