import { BaseEntity } from '../../../utils/helpers/base.entity';
import { UserType } from '../types/user.type';
import { BankType } from '../types/user.type';

export class BankEntity extends BaseEntity<BankType> {}
export class UserEntity extends BaseEntity<UserType> {}
