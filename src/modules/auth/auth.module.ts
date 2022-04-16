import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { WinstonModule } from "nest-winston";
import winstonConfig from "../../config/winston/winston.config";
// eslint-disable-next-line import/no-cycle
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthIntegration } from "./auth.integration";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    HttpModule,
    JwtModule.register({}),
    WinstonModule.forRoot(winstonConfig),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthIntegration, AuthService],
  controllers: [AuthController],
  exports: [AuthIntegration, AuthService],
})
export class AuthModule {}
