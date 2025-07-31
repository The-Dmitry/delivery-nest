import { Response } from 'express';

export function setTokenIntoCookies(
  res: Response,
  { accessToken, refreshToken }: { accessToken: string; refreshToken: string },
) {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 5 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
}
