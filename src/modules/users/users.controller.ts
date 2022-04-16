import { TransformPlainToClass } from "@nestjs/class-transformer";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { Public } from "../auth/decorators/public.decorator";
import { User } from "./entities/user.entity";
import { IdSchema } from "./schemas/id-schema";
import { UserInputSchema } from "./schemas/user/user-input.schema";
import { UserListQuerySchema } from "./schemas/user/user-list-query.schema";
import { UserResponseSchema } from "./schemas/user/user-response.schema";
import { UserUpdateSchema } from "./schemas/user/user-update.schema";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @Public()
  @Post("")
  @TransformPlainToClass(UserResponseSchema)
  async createUser(@Body() user: UserInputSchema): Promise<User> {
    return this.userService.create(user);
  }

  @Public()
  @Patch("/:id")
  @TransformPlainToClass(UserResponseSchema)
  updateUser(
    @Param() idSchema: IdSchema,
    @Body() body: UserUpdateSchema
  ): Promise<User> {
    return this.userService.update(idSchema.id, body);
  }

  @Public()
  @Get("/:id")
  @TransformPlainToClass(UserResponseSchema)
  findUser(@Param() idSchema: IdSchema): Promise<User | undefined> {
    return this.userService.findOneOrFail(idSchema.id);
  }

  @Public()
  @Get()
  @TransformPlainToClass(UserResponseSchema)
  findAllUsers(
    @Query() userListQuerySchema: UserListQuerySchema
  ): Promise<User[]> {
    return this.userService.findAll(userListQuerySchema);
  }

  @Public()
  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  removeUser(@Param() idSchema: IdSchema): Promise<void> {
    return this.userService.remove(idSchema.id);
  }
}
