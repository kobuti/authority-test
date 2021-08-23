import { ClassSerializerInterceptor, Headers, HttpCode } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { PermissionGuard } from 'src/annotations/permission.guard';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(PermissionGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<UserDto[]> {
    return this.usersService.getUsers();
  }

  @Get('/:searchParam')
  async getUserByEmail(
    @Param('searchParam') searchParam: string,
  ): Promise<UserDto> {
    return this.usersService.getUser(searchParam);
  }

  @Post()
  async createUser(@Body() createUserDto: UserDto): Promise<UserDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  async updateUser(@Body() updateUser: Partial<UserDto>): Promise<UserDto> {
    return this.usersService.updateUser(updateUser);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Headers('authorization') loginToken: string): Promise<LoginDto> {
    const user = await this.usersService.login(loginToken);

    return user;
  }
}
