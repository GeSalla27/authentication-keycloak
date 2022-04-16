import { Exclude, Expose } from "@nestjs/class-transformer";
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from "@nestjs/class-validator";

@Exclude()
export class UserListQuerySchema {
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  age?: number;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;
}
