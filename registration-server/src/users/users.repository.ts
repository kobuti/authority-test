import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UserAddress } from './user.address.entity';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userDto: UserDto): Promise<User> {
    try {
      const userAddress = new UserAddress();
      userAddress.zipCode = userDto.userAddress.zipCode;
      userAddress.streetAddress = userDto.userAddress.streetAddress;
      userAddress.buildNumber = userDto.userAddress.buildNumber;
      userAddress.neighborhood = userDto.userAddress.neighborhood;
      userAddress.city = userDto.userAddress.city;
      userAddress.state = userDto.userAddress.state;

      await userAddress.save();

      const user = this.create();
      user.name = userDto.name;
      user.password = userDto.password;
      user.email = userDto.email;
      user.userAddress = userAddress;

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

  async getUser(searchParams: any): Promise<User> {
    let whereClause = '';

    if (searchParams.id) {
      whereClause = 'user.id = :id';
    } else {
      whereClause = 'user.email = :email';
    }

    return this.createQueryBuilder('user')
      .innerJoinAndSelect('user.userAddress', 'userAddress')
      .where(whereClause, searchParams)
      .getOne();
  }

  async updateUser(updateUser: Partial<UserDto>): Promise<User> {
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
