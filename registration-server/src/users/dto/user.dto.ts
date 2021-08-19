import { User } from '../user.entity';

export class UserDto {
  email: string;
  name: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(dbUser: User): UserDto {
    if (!dbUser) return;

    const user = new UserDto();
    user.name = dbUser.name;
    user.email = dbUser.email;
    user.token = Buffer.from(`${dbUser.email}:${dbUser.password}`).toString(
      'base64',
    );
    user.createdAt = dbUser.createdAt;
    user.updatedAt = dbUser.updatedAt;

    return user;
  }
}
