export interface JwtPayload {
  sub: string | number;
  email?: string;
  username?: string;
  roles?: string[];
  [key: string]: any;
}
