import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';

function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  async login(user: LoginDto) {
    const foundUser = await this.userRepository.findOneBy({
      userName: user.userName,
    });

    if (!foundUser) {
      throw new HttpException('用户名不存在', 404);
    }

    if (foundUser.password !== md5(user.password)) {
      throw new HttpException('密码错误', 400);
    }

    return foundUser;
  }

  async register(user: RegisterDto) {
    const foundUser = await this.userRepository.findOneBy({
      userName: user.userName,
    });

    if (foundUser) {
      throw new HttpException('用户已存在', 200);
    }

    const newUser = new User();
    newUser.userName = user.userName;
    newUser.password = md5(user.password);

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (error) {
      this.logger.error(error, UserService);
      return '注册失败';
    }
  }

  async getUserInfo(userId: number) {
    return await this.userRepository.findOne({
      select: ['id', 'userName', 'createTime', 'updateTime'],
      where: {
        id: userId,
      },
    });
  }

  async updateUserInfo(userId: number, password: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException('用户不存在', 404);
    }

    user.password = md5(password);

    try {
      await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(error, UserService);
      throw new BadRequestException('更新失败');
    }
  }
}
