import { Exclude, Expose, Type } from 'class-transformer';
import { UserAddressDto } from './user.address.dto';

@Exclude()
export class UserDto {
  @Expose()
  userId: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => UserAddressDto)
  userAddress: UserAddressDto;

  password: string;

  passwordConfirmation: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
