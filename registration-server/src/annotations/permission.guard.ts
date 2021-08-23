import {
  Injectable,
  CanActivate,
  ExecutionContext,
  RequestMethod,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    if (/\/login/.test(request.url)) {
      return true;
    } else if (/\/users/.test(request.url) && request.method == 'POST') {
      return true;
    } else if (request.method == RequestMethod.PATCH) {
      const authorization = headers['authorization'].replace(/Basic /, '');

      const decodedToken = Buffer.from(authorization, 'base64').toString();
      const email = decodedToken.split(':')[0];

      return request?.body?.email == email;
    }

    return headers['authorization'] != undefined;
  }
}
