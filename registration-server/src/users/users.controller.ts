import { Header, Headers, HttpCode } from '@nestjs/common';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { PermissionGuard } from 'src/helpers/permission.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(PermissionGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<UserDto[]> {
    return this.usersService.getUsers();
  }

  @Get('/:email')
  async getUserByEmail(@Param('email') email: string): Promise<UserDto> {
    return this.usersService.getUserByEmail(email);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  async updateUser(@Body() updateUser: UpdateUserDto): Promise<UpdateUserDto> {
    return this.usersService.updateUser(updateUser);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Headers('authorization') loginToken: string): Promise<LoginDto> {
    return this.usersService.login(loginToken);
  }
}
