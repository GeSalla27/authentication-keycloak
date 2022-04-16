import { Expose } from "@nestjs/class-transformer";

export class IntrospectSchema {
  @Expose()
  acr: string;

  @Expose()
  active: boolean;

  @Expose()
  aud: string;

  @Expose()
  exp: number;

  @Expose()
  iat: number;

  @Expose()
  jti: string;

  @Expose()
  nbf: number;

  @Expose()
  typ: string;
}
