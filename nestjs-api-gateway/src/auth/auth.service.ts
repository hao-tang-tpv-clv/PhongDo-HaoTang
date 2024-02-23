// Nest
import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// Vendor
import { catchError, firstValueFrom } from 'rxjs';

// Src
import { modulesConst } from '@common/constants';
import { GoogleAuthDto, SignInDto, SignUpDto } from '@common/dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(modulesConst.USER_SERVICE)
    private readonly userService: ClientProxy,
    private readonly httpService: HttpService,
  ) {}

  signIn = async (signInDto: SignInDto) => {
    try {
      const result = await firstValueFrom(
        this.userService.send('sign_in', signInDto).pipe(
          catchError((error) => {
            throw new HttpException(error.message, error.status);
          }),
        ),
      );
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  signUp = async (signUpDto: SignUpDto) => {
    try {
      const result = await firstValueFrom(
        this.userService.send('sign_up', signUpDto).pipe(
          catchError((error) => {
            throw new HttpException(error.message, error.status);
          }),
        ),
      );
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  googleSignIn = (googleAuthDto: GoogleAuthDto) => {
    return this.userService.send('google_sign_in', googleAuthDto);
  };
}
