import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Res,
  Param,
  UnauthorizedException,
  Query,
  Patch,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as admin from 'firebase-admin';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Post('/add/:id')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Param('id') userID: string,
  ) {
    console.log('Submitted');
    return this.userService.createUser({ ...createUserDto }, userID);
  }

  @Get('createCreds')
  async createCreds(
    @Query('type') userType: string,
    @Query('lastName') ln: string,
  ) {
    let email = '';
    let password = '';
    let hashUser = await bcrypt.hash(ln, 3);
    let sliceHash = hashUser.slice(7, 12);

    if (userType == 'writer') {
      email = 'writer' + sliceHash + '@test.com';
    } else {
      email = 'editor' + sliceHash + '@test.com';
    }
    password = email + ln;

    return {
      email,
      password,
    };
  }

  @Post('login')
  async loginUser(
    @Headers('Authorization') bearer: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authToken = bearer;
    let tokenVerify: any;

    if (authToken && authToken.startsWith('Bearer ')) {
      const token = authToken.split(' ')[1];
      try {
        tokenVerify = await admin.auth().verifyIdToken(token);
        res.cookie('__Secure__', token, { httpOnly: true, secure: true });
        res.cookie('__Security__', bcrypt.hash(tokenVerify.uid, 10), {
          httpOnly: true,
          secure: true,
        });
        const user = await this.userService.loginUser(tokenVerify);
        res.cookie('__userType__', user.type);
        res.cookie('__user__', `${user.firstname}`);
        return user;
      } catch (e) {
        console.log(e);
      }
    } else {
      throw new UnauthorizedException('No valid Bearer token found');
    }
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    ['__Secure__', '__Security__', '__userType__', '__user__'].forEach(
      (cookie) => {
        response.clearCookie(cookie);
      },
    );
    return 'Success';
  }

  @Patch('update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<UpdateUserDto>,
  ) {
    return this.userService.updateUser(id, { ...updateUserDto });
  }
}
