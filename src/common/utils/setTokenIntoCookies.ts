import { Response } from 'express';

export function setTokenIntoCookies(
  res: Response,
  { accessToken, refreshToken }: { accessToken: string; refreshToken: string },
) {
  const secure = process.env.PRODUCTION === 'true';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 5 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
}
