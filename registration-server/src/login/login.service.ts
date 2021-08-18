import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
  login(userName: string, password: string): string {
    return 'logged';
  }
}
