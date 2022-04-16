import { Controller, Get } from "@nestjs/common";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
  // eslint-disable-next-line no-useless-constructor
  constructor(private healthService: HealthService) {}

  @Get("")
  async healthcheck(): Promise<void> {
    await this.healthService.healthcheck();
  }
}
