import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UsersModule } from './users/users.module';
import { ZipcodeService } from './zipcode/zipcode.service';
import { ZipcodeController } from './zipcode/zipcode.controller';
import { ZipcodeModule } from './zipcode/zipcode.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    HttpModule,
    UsersModule,
    ZipcodeModule,
  ],
  controllers: [ZipcodeController],
  providers: [ZipcodeService],
})
export class AppModule {}
