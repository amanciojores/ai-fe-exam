import {
  Controller,
  Get,
  Post,
  Body,
  // Param,
  // Patch,
  // Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async findAllUsers() {
    return this.userService.findAllUsers();
  }

  // @Get(':id')
  // async findUserById(@Param('id') id: string) {
  //   return this.userService.findUserById(id);
  // }

  // @Patch(':id')
  // async updateUser(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return this.userService.updateUser(id, updateUserDto);
  // }

  // @Delete(':id')
  // async deleteUser(@Param('id') id: string) {
  //   return this.userService.deleteUser(id);
  // }
}
