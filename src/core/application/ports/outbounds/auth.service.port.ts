export abstract class AuthServicePort {
  abstract verifyToken(
    token: string,
  ): Promise<{ userId: string; email: string; name: string }>;
}
