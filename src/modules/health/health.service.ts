import { Injectable } from "@nestjs/common";
import { HealthRepository } from "./health.repository";

@Injectable()
export class HealthService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private repo: HealthRepository) {}

  async healthcheck(): Promise<void> {
    await this.repo.healthcheck();
  }
}
