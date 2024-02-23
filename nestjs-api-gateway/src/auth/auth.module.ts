// Nest
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

// Src
import { UserModules } from '@common/modules/tcpModules';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModules,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
