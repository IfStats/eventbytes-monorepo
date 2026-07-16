import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SUPER_SECRET_KEY_CHANGE_THIS_IN_PRODUCTION', // Put this in your .env
      signOptions: { expiresIn: '7d' }, // Token valid for 7 days
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
