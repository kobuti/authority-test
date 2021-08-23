import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ZipcodeDto } from './dto/zipcode.dto';
import { ZipcodeService } from './zipcode.service';

@Controller('zipcode')
export class ZipcodeController {
  constructor(private zipcodeService: ZipcodeService) {}
  @Get('/:zipcode')
  @UseInterceptors(ClassSerializerInterceptor)
  public async getZipcode(
    @Param('zipcode') zipcode: string,
  ): Promise<ZipcodeDto> {
    return this.zipcodeService.getZipcodeInfo(zipcode);
  }
}
