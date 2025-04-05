export class TokenPayloadDto {
  sub: string;
  email: string;
  aud: string;
  iss: string;
  secret: string;
  exp: number;
}
