import { Test, TestingModule } from "@nestjs/testing";
import KnexBuilder, { Knex } from "knex";
import { WinstonModule, WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as winston from "winston";
import { KNEX_TOKEN } from "../../../constants";
import knexConfigs from "../../../database/knexfile";
import { HealthRepository } from "../health.repository";

describe("Health repository", () => {
  let healthRepository: HealthRepository;
  let knex: Knex;
  let module: TestingModule;
  const logger = sinon.stub(winston.createLogger());

  beforeAll(async () => {
    knex = KnexBuilder(knexConfigs);
    await knex.migrate.rollback(undefined, true);
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.migrate.rollback(undefined, true);
    await knex.destroy();
  });

  beforeEach(async () => {
    sinon.reset();

    await knex.seed.run();

    module = await Test.createTestingModule({
      imports: [
        {
          module: WinstonModule,
          providers: [
            {
              provide: WINSTON_MODULE_PROVIDER,
              useValue: logger,
            },
          ],
          exports: [WINSTON_MODULE_PROVIDER],
        },
      ],
      providers: [
        HealthRepository,
        {
          provide: KNEX_TOKEN,
          useValue: knex,
        },
      ],
    }).compile();

    healthRepository = module.get<HealthRepository>(HealthRepository);
  });

  afterEach(async () => {
    sinon.reset();
    await module.close();
  });

  it("Should select 1 from database", async () => {
    await healthRepository.healthcheck();
  });
});
