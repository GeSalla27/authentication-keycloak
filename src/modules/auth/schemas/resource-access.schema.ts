import { Exclude, Expose, Type } from "@nestjs/class-transformer";
import { ValidateNested } from "@nestjs/class-validator";
import { AccountSchema } from "./account.schema";

@Exclude()
export class ResourceAccessSchema {
  @Expose()
  @ValidateNested()
  @Type(() => AccountSchema)
  account: AccountSchema;
}
