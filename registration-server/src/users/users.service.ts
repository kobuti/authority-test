import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { HttpException } from '@nestjs/common';

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

    if (!user.userId && !user.password) {
      throw new UnprocessableEntityException(`The password cannot be blank`);
    }

    if (!user.userId && !user.passwordConfirmation) {
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
    try {
      this.validate(createUser);

      return await this.userRepository.save(createUser);
    } catch (error) {
      throw error;
    }
  }

  async getUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.find({
      loadRelationIds: true,
    });

    return users.map((user) => new UserDto(user));
  }

  async getUser(searchParam: string): Promise<UserDto> {
    const searchObj: any = {};

    if (this.validateEmail(searchParam)) {
      searchObj.email = searchParam;
    } else {
      searchObj.userId = searchParam;
    }

    const user = await this.userRepository.findOne({
      where: searchObj,
      relations: ['userAddress'],
    });
    return new UserDto(user);
  }

  async updateUser(dto: UserDto): Promise<UserDto> {
    try {
      this.validate(dto);

      if (!dto.password) {
        delete dto.password;
        delete dto.passwordConfirmation;
      }

      return this.userRepository.save(dto);
    } catch (error) {
      throw error;
    }
  }

  async login(loginToken: string): Promise<LoginDto> {
    loginToken = loginToken.replace(/Basic /, '');
    const decoded = Buffer.from(loginToken, 'base64').toString();
    const email = decoded.split(':')[0];
    const password = decoded.split(':')[1];

    const user = await this.userRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'User and/or password invalid',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return new LoginDto(user);
  }
}
