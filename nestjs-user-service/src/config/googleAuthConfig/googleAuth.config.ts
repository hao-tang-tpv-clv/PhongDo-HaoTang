// Nest
import { registerAs } from '@nestjs/config';

// Vendor
import { IsString, ValidateIf } from 'class-validator';
import * as process from 'process';

// Src
import { GoogleAuthType } from '@typings/config.type';
import { validate } from '@src/utils';

class GoogleEnvVariables {
  @ValidateIf((envValues) => envValues.GOOGLE_AUTH_CLIENT_ID)
  @IsString()
  GOOGLE_AUTH_CLIENT_ID: string;

  @ValidateIf((envValues) => envValues.GOOGLE_AUTH_CLIENT_SECRET)
  @IsString()
  GOOGLE_AUTH_CLIENT_SECRET: string;
}

export const googleAuthConfig = registerAs<GoogleAuthType>('googleAuth', () => {
  validate(process.env, GoogleEnvVariables);

  return {
    googleClientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  };
});
