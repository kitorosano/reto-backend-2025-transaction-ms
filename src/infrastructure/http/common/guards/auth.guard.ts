import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthServicePort } from '../../../../core/application/ports/outbounds/auth.service.port';
import { ErrorCodesKeys } from '../../../../shared/errors/error-code-keys.enum';
import { BadModelException } from '../../../../shared/errors/exceptions/bad-model.exception';
import { InvalidPermissionsException } from '../../../../shared/errors/exceptions/invalid-permissions.exception';
import { Log } from '../../../../shared/utils/log';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthServicePort) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    Log.info('AuthGuard', 'Checking if user is authenticated...');
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers['authorization'];

    if (!authorization)
      throw new BadModelException(ErrorCodesKeys.AUTH_HEADER_NOT_PROVIDED);

    const tokenWithoutBearer = authorization.replace('Bearer', '').trim();
    if (!tokenWithoutBearer)
      throw new InvalidPermissionsException(ErrorCodesKeys.TOKEN_NOT_VALID);

    const decodedToken = await this.authService
      .verifyToken(tokenWithoutBearer)
      .catch(() => {
        throw new InvalidPermissionsException(
          ErrorCodesKeys.USER_NOT_AUTHENTICATED,
        );
      });

    request['user'] = decodedToken;

    Log.info('AuthGuard', `User ${decodedToken.email} is authenticated`);

    return true;
  }
}
