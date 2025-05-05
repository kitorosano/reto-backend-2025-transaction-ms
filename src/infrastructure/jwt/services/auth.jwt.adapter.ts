import { JwtService } from '@nestjs/jwt';
import { AuthServicePort } from '../../../core/application/ports/outbounds/auth.service.port';

type DecodedToken = {
  userId: string;
  email: string;
  name: string;
};

export class AuthJWTAdapter implements AuthServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async verifyToken(token: string): Promise<DecodedToken> {
    const verifiedToken = await this.jwtService.verifyAsync(token);
    console.log({ verifiedToken });
    return verifiedToken as DecodedToken;
  }
}
