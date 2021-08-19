import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
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
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NO_CONTENT,
          error: 'User not found!',
        },
        HttpStatus.NO_CONTENT,
      );
    }
  }

  async login(loginToken: string): Promise<User> {
    const decoded = Buffer.from(loginToken, 'base64').toString();
    const email = decoded.split(':')[0];
    const password = decoded.split(':')[1];

    const user = await this.createQueryBuilder('user')
      .where('user.email = :email and user.password = :password', {
        email: email,
        password: password,
      })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Username and/or password incorrect');
    }

    return user;
  }
}
