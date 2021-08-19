import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class EditGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;

    const authorization = headers['authorization'].replace(/Basic /, '');

    const decodedToken = Buffer.from(authorization, 'base64').toString();
    const email = decodedToken.split(':')[0];

    return request?.body?.email == email;
  }
}
