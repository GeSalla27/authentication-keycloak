import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsArray } from "@nestjs/class-validator";

@Exclude()
export class AccountSchema {
  @Expose()
  @IsArray()
  roles: string[];
}
