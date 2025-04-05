import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  database: {
    type: process.env.DATABASE_TYPE as 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
  },
  cache: {
    url: process.env.CACHE_URL,
    lruSize: Number(process.env.CACHE_LRU_SIZE) || 5000,
    ttl: Number(process.env.CACHE_TTL) || 60,
  },
}));
