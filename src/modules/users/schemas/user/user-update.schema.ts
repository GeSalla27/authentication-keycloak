import { Exclude, Expose } from "@nestjs/class-transformer";
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from "@nestjs/class-validator";

@Exclude()
export class UserUpdateSchema {
  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  age?: number;

  @Expose()
  @IsEmail()
  @IsOptional()
  email?: string;
}
