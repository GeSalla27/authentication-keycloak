import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { KNEX_TOKEN, USER_TABLE } from "../../constants";
import { User } from "./entities/user.entity";
import { UserFilter } from "./types/user-filter.type";
import { UserInputType } from "./types/user-input.type";

@Injectable()
export class UsersRepository {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject(KNEX_TOKEN) private readonly knex: Knex) {}

  async exists(filter: UserFilter): Promise<boolean> {
    const query = this.knex<User>(USER_TABLE).column(
      this.knex.raw("1 as exists")
    );

    if (filter.id) {
      query.where({ id: filter.id });
    }

    if (filter.email) {
      query.where({ email: filter.email });
    }

    const tenant = await query.first<User>();

    return !!tenant;
  }

  async find(filter: UserFilter): Promise<User[]> {
    const query = this.knex<User>(USER_TABLE);

    if (filter.id) {
      query.where({ id: filter.id });
    }

    if (filter.name) {
      query.where({ name: filter.name });
    }

    if (filter.age) {
      query.where({ age: filter.age });
    }

    if (filter.email) {
      query.where({ email: filter.email });
    }

    return query;
  }

  async findOne(id: string): Promise<User | null> {
    const query = this.knex<User>(USER_TABLE).select<User>().where({ id });

    return query.first<User>();
  }

  async save(values: UserInputType): Promise<User> {
    const [user] = await this.knex<User>(USER_TABLE)
      .insert({
        ...values,
      })
      .returning("*");

    return user;
  }

  async update(values: Partial<User>): Promise<User> {
    const [user] = await this.knex<User>(USER_TABLE)
      .update({
        updated_at: this.knex.fn.now(),
        ...values,
      })
      .where({
        id: values.id,
      })
      .returning("*");

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.knex<User>(USER_TABLE).delete().where({ id });
  }
}
