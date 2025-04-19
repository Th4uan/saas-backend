import { registerAs } from '@nestjs/config';

const toBool = (val?: string) => val?.toLowerCase() === 'true';

export default registerAs('cookie', () => {
  return {
    httpOnly: toBool(process.env.COOKIE_HTTP_ONLY),
    secure: toBool(process.env.COOKIE_SECURE),
    sameSite: process.env.COOKIE_SAME_SITE,
    maxAge: Number(process.env.COOKIE_MAX_AGE ?? '3600'),
    maxAgeRefresh: Number(process.env.COOKIE_MAX_AGE_REFRESH ?? '86400'),
  };
});
