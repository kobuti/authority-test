import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  private validate(user: CreateUserDto) {
    if (!this.validateEmail(user)) {
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

  private validateEmail(user: CreateUserDto) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(user.email.toLowerCase());
  }

  async createUser(createUser: CreateUserDto): Promise<UserDto> {
    this.validate(createUser);

    const persistedUser = await this.userRepository.createUser(createUser);
    return UserDto.fromEntity(persistedUser);
  }

  async getUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.getUsers();

    return users.map((user) => {
      return UserDto.fromEntity(user);
    });
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    const user: User = await this.userRepository.getUserByEmail(email);

    return UserDto.fromEntity(user);
  }

  async updateUser(
    email: string,
    pass: string,
    updateUser: UpdateUserDto,
  ): Promise<UserDto> {
    const updatedUser = await this.userRepository.updateUser(
      email,
      pass,
      updateUser,
    );

    const dto = new UserDto();

    dto.email = email;
    dto.name = updatedUser.name;
    dto.token = Buffer.from(
      `${updatedUser.email}:${updatedUser.password}`,
    ).toString('base64');

    return dto;
  }

  async login(login: LoginDto): Promise<UserDto> {
    const user: User = await this.userRepository.login(login);

    if (!user) {
      throw new UnprocessableEntityException(
        'Username and/or password incorrect',
      );
    } else {
      return UserDto.fromEntity(user);
    }
  }
}
