import { Module, ValidationPipe } from "@nestjs/common";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { WinstonModule } from "nest-winston";
import winstonConfig from "../../config/winston/winston.config";
import { KNEX_TOKEN } from "../../constants";
import knexConfig from "../../database/knexfile";
import { AuthModule } from "../auth/auth.module";
import { JwtGuard } from "../auth/jwt.guard";
import { HealthModule } from "../health/health.module";
import { KnexModule } from "../knex/knex.module";
import { UsersModule } from "../users/users.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    AuthModule,
    HealthModule,
    KnexModule.forRoot(KNEX_TOKEN, knexConfig),
    UsersModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useValue: new ValidationPipe({}) },
    { provide: APP_GUARD, useClass: JwtGuard },
  ],
})
export class AppModule {}
