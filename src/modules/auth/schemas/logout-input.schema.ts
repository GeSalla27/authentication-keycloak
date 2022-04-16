import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsNotEmpty, IsString } from "@nestjs/class-validator";

@Exclude()
export class LogoutInputSchema {
  @Expose()
  @IsNotEmpty()
  @IsString()
  email: string;
}
