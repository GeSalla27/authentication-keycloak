import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
// eslint-disable-next-line import/no-cycle
import { AuthService } from "../auth/auth.service";
import { User } from "./entities/user.entity";
import { UserInputSchema } from "./schemas/user/user-input.schema";
import { UserListQuerySchema } from "./schemas/user/user-list-query.schema";
import { UserFilter } from "./types/user-filter.type";
import { UserInputType } from "./types/user-input.type";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async create(userInputSchema: UserInputSchema): Promise<User> {
    this.logger.info("Creating new user");
    const keycloakCreateUserSchema = {
      email: userInputSchema.email,
      password: userInputSchema.password,
    };

    const userIdSchema = await this.authService.createUser(
      keycloakCreateUserSchema
    );

    const userInputType: UserInputType = {
      id: userIdSchema.id,
      age: userInputSchema.age,
      email: userInputSchema.email,
      name: userInputSchema.name,
    };

    return this.usersRepository.save(userInputType);
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne(id);
  }

  async findOneOrFail(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      this.logger.warn("User not found");
      throw new NotFoundException("User not found");
    }

    return user;
  }

  findAll(params: UserListQuerySchema): Promise<User[]> {
    const filters: UserFilter = params;

    this.logger.info("Finding all users");

    return this.usersRepository.find(filters);
  }

  async update(id: string, attrs: Partial<User>): Promise<User> {
    await this.findOneOrFail(id);
    return this.usersRepository.update({
      ...attrs,
      id,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOneOrFail(id);

    try {
      await this.authService.deleteUser(id);
    } catch (error: any) {
      if (error.isAxiosError) {
        throw new NotFoundException(error.response?.data?.error);
      }
    }

    await this.usersRepository.delete(id);
  }
}
