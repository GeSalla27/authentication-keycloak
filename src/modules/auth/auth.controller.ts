import { TransformPlainToClass } from "@nestjs/class-transformer";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Jwt } from "./decorators/jwt.decorator";
import { Public } from "./decorators/public.decorator";
import { AuthenticatedUserSchema } from "./schemas/authenticated-user.schema";
import { LoginInputSchema } from "./schemas/login-input.schema";
import { LoginResponseSchema } from "./schemas/login-response.schema";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @TransformPlainToClass(LoginResponseSchema)
  async login(@Body() data: LoginInputSchema): Promise<LoginResponseSchema> {
    return this.authService.login(data);
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Jwt() authenticatedUser: AuthenticatedUserSchema
  ): Promise<void> {
    return this.authService.logout(authenticatedUser.user_id);
  }
}
