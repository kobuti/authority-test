import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Headers,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<UserDto[]> {
    return this.usersService.getUsers();
  }

  @Get('/:token')
  async getUser(@Param() token: string): Promise<UserDto> {
    const decodedToken = Buffer.from(token, 'base64').toString();
    const email = decodedToken.split(':')[0];
    return this.usersService.getUserByEmail(email);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Put()
  async updateUser(
    @Headers() headers: any,
    @Body() updateUser: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    const authentication = headers['Authentication'];
    const authenticationFromHeader = Buffer.from(
      authentication.replace('Basic '),
      'base64',
    ).toString();

    const email = authenticationFromHeader.split(':')[0];
    const pass = authenticationFromHeader.split(':')[1];

    return this.usersService.updateUser(email, pass, updateUser);
  }

  @Post('/login')
  async login(@Body() login: LoginDto): Promise<UserDto> {
    return this.usersService.login(login);
  }
}
