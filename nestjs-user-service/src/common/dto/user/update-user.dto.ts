import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide valid Email.' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Name must have at least 8 characters.' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string;

  @IsInt()
  @IsOptional()
  age: number;

  @IsString()
  @IsOptional()
  @IsEnum(['f', 'm', 'u'])
  gender: string;

  @IsString()
  @IsOptional()
  password: string;
}
