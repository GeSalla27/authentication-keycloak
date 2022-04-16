import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { KNEX_TOKEN } from "../../constants";

@Injectable()
export class HealthRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject(KNEX_TOKEN) private readonly knex: Knex) {}

  async healthcheck(): Promise<void> {
    await this.knex.select(this.knex.raw("1"));
  }
}
