import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthJWTAdapter } from './auth.jwt.adapter';

const mockTokenData = {
  sub: 'jwt',
  email: 'john.doe@email.com',
  name: 'John Doe',
  iat: 1234567890,
  exp: 1234567890,
};

const mockVerifyAsync = jest.fn(() => Promise.resolve(mockTokenData));

describe('AuthJWTAdapter', () => {
  let authService: AuthJWTAdapter;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthJWTAdapter,
        {
          provide: JwtService,
          useFactory: () => ({
            verifyAsync: mockVerifyAsync,
          }),
        },
      ],
    }).compile();

    authService = module.get<AuthJWTAdapter>(AuthJWTAdapter);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  // ==== verifyToken method tests ====
  it('should verify token successfully', async () => {
    const result = await authService.verifyToken('token');

    expect(result.userId).toBe(mockTokenData.sub);
    expect(result.email).toBe(mockTokenData.email);
    expect(result.name).toBe(mockTokenData.name);

    expect(jwtService.verifyAsync).toHaveBeenCalled();
  });
});
