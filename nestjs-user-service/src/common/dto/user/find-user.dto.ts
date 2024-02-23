import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

export class FindUserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsInt()
  age: number;

  @IsString()
  @IsEnum(['f', 'm', 'u'])
  gender: string;

  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;
}
