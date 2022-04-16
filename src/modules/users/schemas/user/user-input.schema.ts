import { Exclude, Expose } from "@nestjs/class-transformer";
import {
  IsEmail,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
} from "@nestjs/class-validator";

@Exclude()
export class UserInputSchema {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @Min(0)
  @Max(99)
  @IsNumber()
  age: number;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]{8,}$/)
  password: string;
}
