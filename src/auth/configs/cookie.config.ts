import { registerAs } from '@nestjs/config';

export default registerAs('cookie', () => {
  return {
    httpOnly: Boolean(process.env.COOKIE_HTTP_ONLY),
    secure: Boolean(process.env.COOKIE_SECURE),
    sameSite: process.env.COOKIE_SAME_SITE,
    maxAge: Number(process.env.COOKIE_MAX_AGE ?? '3600'),
  };
});
