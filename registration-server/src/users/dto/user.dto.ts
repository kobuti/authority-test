import { User } from '../user.entity';

export class UserDto {
  email: string;
  name: string;

  token: string;

  static fromEntity(dbUser: User) {
    const user = new UserDto();
    user.name = dbUser.name;
    user.email = dbUser.email;
    user.token = Buffer.from(`${dbUser.email}:${dbUser.password}`).toString(
      'base64',
    );
    return user;
  }
}
