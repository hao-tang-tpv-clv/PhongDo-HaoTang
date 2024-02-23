// Nest
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

// Src
import { GoogleAuthDto, SignInDto, SignUpDto } from '@common/dto';
import { AuthService } from '@src/auth';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('sign_in')
  signIn(@Payload() signInDto: SignInDto) {
    const result = this.authService.signIn(signInDto);
    return result;
  }

  @MessagePattern('sign_up')
  signUp(@Payload() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @MessagePattern('google_sign_in')
  googleSignIn(@Payload() googleAuthDto: GoogleAuthDto) {
    return this.authService.googleSignIn(googleAuthDto);
  }
}
