import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthServicePort } from '../../../core/application/ports/outbounds/auth.service.port';

type DecodedToken = {
  userId: string;
  email: string;
  name: string;
};

export class AuthJWTAdapter implements AuthServicePort {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async verifyToken(token: string): Promise<DecodedToken> {
    const verifiedToken = await this.jwtService.verifyAsync(token);
    return {
      userId: verifiedToken.sub,
      email: verifiedToken.email,
      name: verifiedToken.name,
    } as DecodedToken;
  }
}
