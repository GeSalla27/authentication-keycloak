import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "./auth.service";
import { IS_PUBLIC } from "./decorators/public.decorator";

@Injectable()
export class JwtGuard implements CanActivate {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();

    const isPublic = this.reflector.get(IS_PUBLIC, handler);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Token type must be bearer");
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("Token not informed");
    }

    await this.authService.introspect(token);

    const authenticatedUser = await this.authService.parseToken(token);

    if (!authenticatedUser) {
      throw new UnauthorizedException("Credentials missing or invalid");
    }

    const userId = authenticatedUser.sub;

    request.authorization = {
      ...authenticatedUser,
      access_token: token,
      user_id: userId,
    };

    return true;
  }
}
