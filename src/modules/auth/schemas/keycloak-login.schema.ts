import { Expose } from "@nestjs/class-transformer";
import { GrantTypeType } from "../types/grant-type.type";

export class KeycloakLoginSchema {
  constructor(
    username: string,
    password: string,
    client_id: string,
    client_secret: string
  ) {
    this.username = username;
    this.password = password;
    this.client_id = client_id;
    this.client_secret = client_secret;
  }

  @Expose()
  grant_type: GrantTypeType = "password";

  @Expose()
  username: string;

  @Expose()
  password: string;

  @Expose()
  client_id: string;

  @Expose()
  client_secret: string;
}
