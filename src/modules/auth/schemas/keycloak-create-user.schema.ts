import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";

@Exclude()
export class KeycloakCreateUserSchema {
  @Expose()
  @IsString()
  @IsEmail()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  password: string;
}
