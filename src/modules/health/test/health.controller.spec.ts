import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { assert } from "chai";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as sinon from "sinon";
import * as request from "supertest";
import * as winston from "winston";
import { HealthController } from "../health.controller";
import { HealthService } from "../health.service";

describe("Health controller", () => {
  const healthService = sinon.createStubInstance(HealthService);
  const logger = sinon.stub(winston.createLogger());

  let app: INestApplication;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: healthService,
        },

        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({}),
        },

        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    app = module.createNestApplication();

    await app.init();
  });

  afterEach(async () => {
    await app.close();
    await module.close();
  });

  it("Should perform healthcheck", async () => {
    healthService.healthcheck.withArgs().resolves();

    const response = await request(app.getHttpServer()).get(`/health`);

    assert.equal(response.status, HttpStatus.OK);
    sinon.assert.calledOnceWithExactly(healthService.healthcheck);
  });
});
