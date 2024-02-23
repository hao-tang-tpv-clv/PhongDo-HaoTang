// Nest
import { registerAs } from '@nestjs/config';

// Vendor
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import * as process from 'process';

// Src
import { PostgresConfigType } from '@src/typings';
import { validate } from '@src/utils';

class PostgresEnvVariables {
  @ValidateIf((envValues) => envValues.POSTGRES_DB_HOST)
  @IsString()
  POSTGRES_DB_HOST: string;

  @ValidateIf((envValues) => envValues.POSTGRES_DB_PORT)
  @IsString()
  POSTGRES_DB_PORT: string;

  @ValidateIf((envValues) => envValues.POSTGRES_DB_USERNAME)
  @IsString()
  POSTGRES_DB_USERNAME: string;

  @ValidateIf((envValues) => envValues.POSTGRES_DB_PASSWORD)
  @IsString()
  POSTGRES_DB_PASSWORD: string;

  @ValidateIf((envValues) => envValues.POSTGRES_DB_NAME)
  @IsString()
  POSTGRES_DB_NAME: string;

  @IsString()
  @IsOptional()
  POSTGRES_DB_TYPE: string;
}

export const postgresConfig = registerAs<PostgresConfigType>('postgres', () => {
  validate(process.env, PostgresEnvVariables);

  return {
    host: process.env.POSTGRES_DB_HOST,
    port: process.env.POSTGRES_DB_PORT
      ? parseInt(process.env.POSTGRES_DB_PORT)
      : 5432,
    username: process.env.POSTGRES_DB_USERNAME,
    password: process.env.POSTGRES_DB_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    type: process.env.POSTGRES_DB_TYPE,
  };
});
