import { SignOptions } from 'jsonwebtoken';

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'e691da24d000bad3fdb4937f87bdf2bad2dccde93c212c6da487e58e0d4c84a99b0599ea18b0bc0eb6387c0d3a8cbb4a38b515014dba33fd1bd046900b3f3dfc',
  accessToken: {
    options: {
      expiresIn: '15m',
      algorithm: 'HS256',
    } as SignOptions,
  },
  refreshToken: {
    options: {
      expiresIn: '7d',
      algorithm: 'HS256',
    } as SignOptions,
  },
}; 