import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    aud: process.env.JWT_TOKEN_AUDIENCE,
    iss: process.env.JWT_TOKEN_ISSUER,
    jwtTtl: Number(process.env.JWT_TTL ?? '3600'),
  };
});
