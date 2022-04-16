import { HttpService } from "@nestjs/axios";
import { classToPlain } from "@nestjs/class-transformer";
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { stringify } from "querystring";
import { firstValueFrom } from "rxjs";
import { Logger } from "winston";
import env from "../main/app.env";
import { IntrospectInputSchema } from "./schemas/introspect-input.schema";
import { KeycloakIntrospectSchema } from "./schemas/introspect-login.schema";
import { IntrospectSchema } from "./schemas/introspect.schema";
import { KeycloakCreateUserSchema } from "./schemas/keycloak-create-user.schema";
import { KeycloakLoginSchema } from "./schemas/keycloak-login.schema";
import { LoginInputSchema } from "./schemas/login-input.schema";
import { LoginResponseSchema } from "./schemas/login-response.schema";

@Injectable()
export class AuthIntegration {
  constructor(
    private readonly httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async login(loginInput: LoginInputSchema): Promise<LoginResponseSchema> {
    const keycloakLoginData = new KeycloakLoginSchema(
      loginInput.email,
      loginInput.password,
      env.CLIENT_ID_USER,
      env.SECRET_USER
    );

    const keycloakLoginPlainData = classToPlain(keycloakLoginData);

    return this.receiveLoginKeycloak(keycloakLoginPlainData);
  }

  async logout(id: string): Promise<void> {
    const realm = env.REALM_NAME;
    const url = `${env.KEYCLOAK_AUTH_SERVER_URL}/admin/realms/${realm}/users/${id}/logout`;
    const access = await this.generateAdminAccess();

    const config = {
      headers: {
        Authorization: `Bearer ${access.access_token}`,
        "Content-Type": "application/json",
      },
    };

    const observable = this.httpService.post(url, {}, config);

    const response = await firstValueFrom(observable);

    return response.data;
  }

  async createUser(user: KeycloakCreateUserSchema): Promise<string> {
    const access = await this.generateAdminAccess();

    if (!access) {
      throw new UnauthorizedException("Invalid access");
    }

    const realm = env.REALM_NAME;

    const url = `${env.KEYCLOAK_AUTH_SERVER_URL}/admin/realms/${realm}/users`;

    const credentials = [{ type: "password", value: user.password }];

    const config = {
      headers: {
        Authorization: `Bearer ${access.access_token}`,
        "Content-Type": "application/json",
      },
    };

    const data = JSON.stringify({
      username: user.email,
      email: user.email,
      enabled: true,
      emailVerified: true,
      credentials,
    });

    return this.createKeycloakUser(url, data, config);
  }

  private async createKeycloakUser(
    url: string,
    data: any,
    config: AxiosRequestConfig
  ): Promise<string> {
    const observable = this.httpService.post(url, data, config);

    const response = await firstValueFrom(observable);

    const id = response.headers.location.split(/[/ ]+/).pop();

    if (id) {
      return id;
    }

    throw new InternalServerErrorException("User id could not be found");
  }

  async deleteUser(userId: string): Promise<void> {
    const access = await this.generateAdminAccess();

    if (!access) {
      throw new UnauthorizedException("Invalid access");
    }

    const realm = env.REALM_NAME;

    const url = `${env.KEYCLOAK_AUTH_SERVER_URL}/admin/realms/${realm}/users/${userId}`;

    const config = {
      headers: {
        Authorization: `Bearer ${access.access_token}`,
      },
    };

    const observable = this.httpService.delete(url, config);

    await firstValueFrom(observable);
  }

  async generateAdminAccess(): Promise<LoginResponseSchema> {
    const realm = env.REALM_NAME;
    const url = `${env.KEYCLOAK_AUTH_SERVER_URL}/realms/${realm}/protocol/openid-connect/token`;

    const data = stringify({
      grant_type: "client_credentials",
    });

    const auth = {
      username: env.CLIENT_ID_ADMIN,
      password: env.SECRET_ADMIN,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth,
    };

    const observable = this.httpService.post(url, data, config);

    const response = await firstValueFrom(observable);

    return response.data;
  }

  async introspect(
    introspectInput: IntrospectInputSchema
  ): Promise<IntrospectSchema> {
    const realm = env.REALM_NAME;

    const url = `${env.KEYCLOAK_AUTH_SERVER_URL}/realms/${realm}/protocol/openid-connect/token/introspect`;

    const keycloakIntrospectData = new KeycloakIntrospectSchema(
      introspectInput.access_token
    );

    const keycloakIntrospectPlainData = classToPlain(keycloakIntrospectData);

    const data = stringify(keycloakIntrospectPlainData);

    const config = {
      auth: { username: env.CLIENT_ID_USER, password: env.SECRET_USER },
    };

    const observable = this.httpService.post(url, data, config);

    const response = await firstValueFrom(observable);

    return response.data;
  }

  private async receiveLoginKeycloak(
    dataInput: Record<string, any>
  ): Promise<LoginResponseSchema> {
    const realm = env.REALM_NAME;

    const url = `${env.KEYCLOAK_AUTH_SERVER_URL}/realms/${realm}/protocol/openid-connect/token`;

    const data = stringify(dataInput);

    const observable = this.httpService.post(url, data);

    const response = await firstValueFrom(observable);

    return response.data;
  }
}
