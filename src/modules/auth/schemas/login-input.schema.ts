import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsNotEmpty, IsString } from "@nestjs/class-validator";

@Exclude()
export class LoginInputSchema {
  @Expose()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;
}
