import { UserId } from './user-id.decorator';

const mockGetRequest = jest.fn().mockImplementation(() => ({
  user: { userId: '123' },
}));

const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getRequest: mockGetRequest,
}));
const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

jest.mock('@nestjs/common', () => {
  const originalModule = jest.requireActual('@nestjs/common');
  return {
    ...originalModule,
    createParamDecorator: jest.fn((fn) => fn),
  };
});

describe('UserId', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the userId from the request', () => {
    const userId = UserId(null, mockArgumentsHost);

    expect(userId).toBe('123');
  });
});
