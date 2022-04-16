import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Jwt = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const { authorization } = ctx.switchToHttp().getRequest();

    return authorization;
  }
);
