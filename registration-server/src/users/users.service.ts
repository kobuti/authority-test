import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  private validate(user: UserDto) {
    if (!this.validateEmail(user.email)) {
      throw new UnprocessableEntityException('Invalid e-mail');
    }

    if (!user.name) {
      throw new UnprocessableEntityException(`The name cannot be blank`);
    }

    if (!user.password) {
      throw new UnprocessableEntityException(`The password cannot be blank`);
    }

    if (!user.passwordConfirmation) {
      throw new UnprocessableEntityException(
        `The password confirmation cannot be blank`,
      );
    }

    if (user.password !== user.passwordConfirmation) {
      throw new UnprocessableEntityException(
        `The password does not match with confirmation`,
      );
    }
  }

  private validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
  }

  async createUser(createUser: UserDto): Promise<UserDto> {
    this.validate(createUser);

    const persistedUser = await this.userRepository.createUser(createUser);
    return new UserDto(persistedUser);
  }

  async getUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.getUsers();
    return users.map((user) => new UserDto(user));
  }

  async getUser(searchParam: string): Promise<UserDto> {
    const searchObj: any = {
      id: null,
      email: null,
    };

    if (this.validateEmail(searchParam)) {
      searchObj.email = searchParam;
    } else {
      searchObj.id = searchParam;
    }

    const user: User = await this.userRepository.getUser(searchObj);
    return new UserDto(user);
  }

  async updateUser(updateUser: Partial<UserDto>): Promise<UserDto> {
    const user = await this.userRepository.updateUser(updateUser);
    return new UserDto(user);
  }

  async login(loginToken: string): Promise<LoginDto> {
    loginToken = loginToken.replace(/Basic /, '');
    const user = await this.userRepository.login(loginToken);
    return new LoginDto(user);
  }
}
