import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from 'src/helpers/auth.guard';
import { EditGuard } from 'src/helpers/edit.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
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
  @UseGuards(EditGuard)
  async updateUser(@Body() updateUser: UpdateUserDto): Promise<UpdateUserDto> {
    return this.usersService.updateUser(updateUser);
  }

  @Post('/login')
  async login(@Body() login: LoginDto): Promise<UserDto> {
    return this.usersService.login(login);
  }
}
