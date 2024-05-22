import { UserEntity } from '../entities/user.entity';

export type CreateUserArgs = Partial<
  Omit<UserEntity, 'çreated_at' | 'updated_at'>
>;

export interface UserRepository {
  createUser(user: CreateUserArgs): Promise<UserEntity>;
}

export type UpdateUserArgs = Partial<Omit<UserEntity, 'created_at'>>;
