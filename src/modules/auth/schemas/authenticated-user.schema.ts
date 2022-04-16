import { Exclude, Expose, Type } from "@nestjs/class-transformer";
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from "@nestjs/class-validator";
import { RealmAccessSchema } from "./realm-access.schema";
import { ResourceAccessSchema } from "./resource-access.schema";

@Exclude()
export class AuthenticatedUserSchema {
  @Expose()
  @IsOptional()
  @IsString()
  acr?: string;

  @Expose()
  @IsOptional()
  aud?: string | string[];

  @Expose()
  @IsOptional()
  @IsString()
  azp?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  email_verified?: boolean;

  @Expose()
  @IsOptional()
  @IsNumber()
  exp?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  iat?: number;

  @Expose()
  @IsOptional()
  @IsString()
  iss?: string;

  @Expose()
  @IsOptional()
  @IsUUID(4)
  jti?: string;

  @Expose()
  @IsOptional()
  @IsString()
  preferred_username?: string;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => RealmAccessSchema)
  realm_access?: RealmAccessSchema;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => ResourceAccessSchema)
  resource_access?: ResourceAccessSchema;

  @Expose()
  @IsOptional()
  @IsString()
  scope?: string;

  @Expose()
  @IsOptional()
  @IsUUID(4)
  session_state?: string;

  @Expose()
  @IsOptional()
  @IsUUID(4)
  sid?: string;

  @Expose()
  @IsUUID(4)
  sub: string;

  @Expose()
  @IsOptional()
  @IsString()
  typ?: string;

  user_id: string;

  access_token: string;
}
