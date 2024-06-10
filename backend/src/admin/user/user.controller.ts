import {
  Controller,
  Post,
  Body,
  Inject,
  ValidationPipe,
  BadRequestException,
  Get,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin, UserInfo } from 'src/custom.decorator';

@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Post('login')
  async login(@Body(ValidationPipe) user: LoginDto) {
    const foundUser = await this.userService.login(user);

    if (foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          userId: foundUser.id,
          userName: foundUser.userName,
        },
      });
      return {
        token,
      };
    } else {
      throw new BadRequestException('登录失败');
    }
  }

  @Post('register')
  async register(@Body(ValidationPipe) user: RegisterDto) {
    return await this.userService.register(user);
  }

  @Get('userInfo')
  @RequireLogin()
  async getUserInfo(@UserInfo('userId') userId: number) {
    return await this.userService.getUserInfo(userId);
  }

  // 更新用户密码
  @Put('userInfo')
  @RequireLogin()
  async updateUserInfo(
    @UserInfo('userId') userId: number,
    @Body('password') password: string,
  ) {
    return await this.userService.updateUserInfo(userId, password);
  }
}
