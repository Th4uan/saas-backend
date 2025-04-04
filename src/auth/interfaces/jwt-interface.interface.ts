export interface JwtPayload {
  sub: string;
  email: string;
  aud?: string;
  iss?: string;
  secret: string | undefined;
  exp: number;
}
