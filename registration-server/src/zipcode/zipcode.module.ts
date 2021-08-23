import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ZipcodeController } from 'src/zipcode/zipcode.controller';
import { ZipcodeService } from './zipcode.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [ZipcodeController],
  providers: [ZipcodeService],
})
export class ZipcodeModule {}
