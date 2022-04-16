import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { HealthRepository } from "./health.repository";
import { HealthService } from "./health.service";

@Module({
  providers: [HealthService, HealthRepository],
  controllers: [HealthController],
})
export class HealthModule {}
