import { plainToClass } from "@nestjs/class-transformer";
import { validate } from "@nestjs/class-validator";
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { IdSchema } from "../users/schemas/id-schema";
// eslint-disable-next-line import/no-cycle
import { UsersService } from "../users/users.service";
import { AuthIntegration } from "./auth.integration";
import { AuthenticatedUserSchema } from "./schemas/authenticated-user.schema";
import { KeycloakCreateUserSchema } from "./schemas/keycloak-create-user.schema";
import { LoginInputSchema } from "./schemas/login-input.schema";
import { LoginResponseSchema } from "./schemas/login-response.schema";

@Injectable()
export class AuthService {
  constructor(
    private readonly authIntegration: AuthIntegration,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async parseToken(token: string): Promise<AuthenticatedUserSchema | null> {
    const payload = this.extractToken(token);

    if (!payload) {
      return null;
    }

    const errors = await validate(payload);

    if (errors.length) {
      return null;
    }

    return payload;
  }

  extractToken(token: string): AuthenticatedUserSchema {
    const tokenData = this.jwtService.decode(token);

    const payload = plainToClass(AuthenticatedUserSchema, tokenData, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    return payload;
  }

  async createUser(user: KeycloakCreateUserSchema): Promise<IdSchema> {
    const id = await this.authIntegration.createUser(user);

    return { id };
  }

  async deleteUser(userId: string): Promise<void> {
    return this.authIntegration.deleteUser(userId);
  }

  async introspect(token: string): Promise<void> {
    const introspectInput = {
      access_token: token,
    };

    const { active } = await this.authIntegration.introspect(introspectInput);

    if (!active) {
      throw new UnauthorizedException("User not authorized");
    }
  }

  async login(data: LoginInputSchema): Promise<LoginResponseSchema> {
    const [user] = await this.userService.findAll({
      email: data.email,
    });

    if (!user) {
      throw new UnauthorizedException("Invalid client");
    }

    try {
      const loginResponseSchema = await this.authIntegration.login(data);

      return loginResponseSchema;
    } catch (error) {
      return AuthService.processError(error);
    }
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException("Invalid client");
    }

    try {
      await this.authIntegration.logout(user.id);
      return;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  private static processError(error: unknown): never {
    throw new UnauthorizedException(error);
  }
}
