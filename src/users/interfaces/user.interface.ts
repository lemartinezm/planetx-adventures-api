export interface User {
  name: string;
  email: string;
  password: string;
}

export interface JwtUser {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
