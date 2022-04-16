import { Exclude, Expose } from "@nestjs/class-transformer";
import { IsArray } from "@nestjs/class-validator";

@Exclude()
export class RealmAccessSchema {
  @Expose()
  @IsArray()
  roles: string[];
}
