import { HttpService } from '@nestjs/axios';
import { UseInterceptors } from '@nestjs/common';
import { ClassSerializerInterceptor, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { ZipcodeDto } from './dto/zipcode.dto';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class ZipcodeService {
  constructor(private config: ConfigService, private http: HttpService) {}

  async getZipcodeInfo(zipcode: string): Promise<ZipcodeDto> {
    const zipcodeServiceUrl: string = this.config.get('ZIPCODE_SERVICE_URL');

    const zipcode$ = this.http.get(`${zipcodeServiceUrl}${zipcode}/json`);

    const apiResponse = await lastValueFrom(zipcode$);

    return new ZipcodeDto(apiResponse.data);
  }
}
