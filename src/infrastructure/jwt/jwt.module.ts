import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import environment from '../../config/environment';
import { AuthServicePort } from '../../core/application/ports/outbounds/auth.service.port';
import { AuthJWTAdapter } from './services/auth.jwt.adapter';

@Module({
  imports: [
    JwtModule.register({
      secret: environment.authDriverSecret,
      verifyOptions: { ignoreExpiration: false },
    }),
  ],
  providers: [
    // Outbound Ports
    {
      provide: AuthServicePort,
      useClass: AuthJWTAdapter,
    },
  ],
  exports: [AuthServicePort],
})
export class JWTModule {}
