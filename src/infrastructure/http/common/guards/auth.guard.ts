import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // TODO: Implement JWT token validation from request headers

    // If the token is valid, we can extract the user ID from it and set it in the request object

    // If the token is invalid, we should throw an UnauthorizedException

    // If the user ID is not valid UUID, we should throw a UnauthorizedException

    // For now, we will just simulate a user ID from the request context
    request['user'] = '4e564d19-edb5-4bc2-ad13-de40cbf12ed5';

    return true;
  }
}
