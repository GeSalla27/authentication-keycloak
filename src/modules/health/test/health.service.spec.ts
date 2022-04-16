import { Test, TestingModule } from "@nestjs/testing";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as winston from "winston";
import { HealthRepository } from "../health.repository";
import { HealthService } from "../health.service";

describe("Health service", () => {
  const healthRepository = sinon.createStubInstance(HealthRepository);
  const logger = sinon.stub(winston.createLogger());

  let healthService: HealthService;

  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: HealthRepository,
          useValue: healthRepository,
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    healthService = module.get<HealthService>(HealthService);
  });

  afterEach(async () => {
    sinon.reset();
    await module.close();
  });

  it("Should perform healthcheck on dependencies", async () => {
    healthRepository.healthcheck.withArgs().resolves();
    await healthService.healthcheck();

    sinon.assert.calledOnceWithExactly(healthRepository.healthcheck);
  });
});
