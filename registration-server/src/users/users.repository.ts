import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { error } from 'node:console';
import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const user = this.create();
      user.name = userDto.name;
      user.password = userDto.password;
      user.email = userDto.email;

      await user.save();

      return user;
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException(
          'An user with this e-mail is already registered',
        );
      } else {
        throw new InternalServerErrorException('Error on saving User');
      }
    }
  }

  async getUsers(): Promise<User[]> {
    return this.createQueryBuilder('user').getMany();
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  async updateUser(updateUser: UpdateUserDto): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .where('user.email = :email', { email: updateUser.email })
      .getOne();

    if (user) {
      user.name = updateUser.name || user.name;
      user.password = user.password || updateUser.password;
      user.updatedAt = new Date();
      return user.save();
    }

    return null;
  }

  async login(login: LoginDto) {
    return this.createQueryBuilder('user')
      .where('user.email = :email and user.password = :password', login)
      .getOne();
  }
}
