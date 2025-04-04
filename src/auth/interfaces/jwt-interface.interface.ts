export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  aud?: string;
  iss?: string;
  secret: string | undefined;
  exp: number;
}
