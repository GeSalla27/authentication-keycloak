import { Expose } from "@nestjs/class-transformer";
import { TokenTypeHintType } from "../types/token-type-hint.type";

export class KeycloakIntrospectSchema {
  constructor(token: string) {
    this.token = token;
  }

  @Expose()
  token_type_hint: TokenTypeHintType = "requesting_party_token";

  @Expose()
  token: string;
}
