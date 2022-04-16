import { Exclude, Expose } from "@nestjs/class-transformer";

@Exclude()
export class LoginResponseSchema {
  @Expose()
  access_token: string;

  @Expose()
  expires_in: number;

  @Expose()
  id_token: string;

  @Expose()
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "not-before-policy": number;

  @Expose()
  refresh_expires_in: number;

  @Expose()
  refresh_token: string;

  @Expose()
  scope: string;

  @Expose()
  session_state: string;

  @Expose()
  token_type: string;
}
