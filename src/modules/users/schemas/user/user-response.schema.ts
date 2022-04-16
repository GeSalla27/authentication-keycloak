import { Exclude, Expose } from "@nestjs/class-transformer";

@Exclude()
export class UserResponseSchema {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  age: number;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
