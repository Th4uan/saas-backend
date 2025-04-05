export interface Jwt {
  sub: string;
  aud?: string;
  iss?: string;
  secret: string | undefined;
  exp: number;
}

export interface JwtPayload extends Jwt {
  email: string;
  role: string;
}
