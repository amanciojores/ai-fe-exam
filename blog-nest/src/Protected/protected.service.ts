import { Injectable } from '@nestjs/common';
import { Response } from 'express';
@Injectable()
export class ProtectedService {
  constructor() {}

  async clearCookies(res: Response, cookies: string[]) {
    for (let i = 0; i < cookies.length; i++) {
      res.cookie(cookies[i], '', {
        expires: new Date(0),
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
    }
  }
}
