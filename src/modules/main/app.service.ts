import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  // eslint-disable-next-line class-methods-use-this
  getHello(): any {
    return { "poc-keycloak": "Hello World!" };
  }
}
