import { Test, TestingModule } from '@nestjs/testing';
import { AuthServicePort } from '../../../../core/application/ports/outbounds/auth.service.port';
import { BadModelException } from '../../../../shared/errors/exceptions/bad-model.exception';
import { InvalidPermissionsException } from '../../../../shared/errors/exceptions/invalid-permissions.exception';
import { AuthJWTAdapter } from '../../../jwt/services/auth.jwt.adapter';
import { AuthGuard } from './auth.guard';

const mockDecodedToken = {};

const mockVerifyToken = jest.fn().mockResolvedValue(mockDecodedToken);

describe('AuthGuard', () => {
  let testingModule: TestingModule;
  let guard: AuthGuard;
  let jwtService: AuthJWTAdapter;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthServicePort,
          useFactory: () => ({
            verifyToken: mockVerifyToken,
          }),
        },
      ],
    }).compile();

    guard = testingModule.get<AuthGuard>(AuthGuard);
    jwtService = testingModule.get<AuthJWTAdapter>(AuthServicePort);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should allow access if token is valid', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Bearer mytoken' } }),
      }),
    } as any;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(mockVerifyToken).toHaveBeenCalledWith('mytoken');
  });

  it('should throw BadModelException if authorization header is not provided', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: {} }),
      }),
    } as any;

    await expect(guard.canActivate(context)).rejects.toThrow(BadModelException);
  });

  it('should throw InvalidPermissionsException if token is not provided in authorization header', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Bearer ' } }),
      }),
    } as any;

    await expect(guard.canActivate(context)).rejects.toThrow(
      InvalidPermissionsException,
    );
  });

  it('should throw InvalidPermissionsException if token is invalid', async () => {
    mockVerifyToken.mockRejectedValueOnce(new Error('Invalid token'));

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization: 'Bearer mytoken' } }),
      }),
    } as any;

    await expect(guard.canActivate(context)).rejects.toThrow(
      InvalidPermissionsException,
    );
    expect(mockVerifyToken).toHaveBeenCalledWith('mytoken');
  });
});
