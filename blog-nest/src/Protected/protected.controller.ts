import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { UserService } from 'src/Users/user.service';
import { ProtectedService } from './protected.service';

@Controller('protected')
export class ProtectedController {
  constructor(
    private userService: UserService,
    private protectedService: ProtectedService,
  ) {}
  @Post('checkToken')
  async checkToken(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const userToken = req.cookies['__Secure__'];
    if (!userToken) {
      return null;
    }
    try {
      const tokenVerify = await admin.auth().verifyIdToken(userToken);
      return this.userService.loginUser(tokenVerify as any);
    } catch (err) {
      if (err.code === 'auth/id-token-expired') {
        this.protectedService.clearCookies(res, ['__Secure__', '__Security__']);
        return ['Token Expired'];
      } else {
        console.error('Token Verification Failed', err);
      }
    }
  }
}
