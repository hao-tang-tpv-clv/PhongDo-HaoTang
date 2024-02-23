// Nest
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

// Src
import { LocalStrategy, JwtStrategy } from '@common/strategies';
import { UserModule } from '@modules/user';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
