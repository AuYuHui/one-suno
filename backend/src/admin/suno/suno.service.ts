import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateSunoDto } from './dto/create-suno.dto';
import { Suno } from './entities/suno.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UpdateSunoDto } from './dto/update-suno.dto';
import dayjs from 'dayjs';
import { RedisService } from 'src/redis/redis.service';

const SunoKey = 'Suno';

@Injectable()
export class SunoService {
  private logger = new Logger();
  @InjectRepository(Suno)
  private sunoRepository: Repository<Suno>;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  async create(createSunoDto: CreateSunoDto) {
    const suno = new Suno();
    suno.cookie = createSunoDto.cookie;
    suno.credit = createSunoDto.credit || 0;
    suno.count = createSunoDto.count || 0;
    suno.status = createSunoDto.status;
    suno.account = createSunoDto.account;
    suno.password = createSunoDto.password;
    suno.accountType = createSunoDto.accountType;

    try {
      await this.sunoRepository.save(suno);

      this.redisService.insert(
        `${SunoKey}_${suno.account.toString()}`,
        suno.cookie,
      );
      return suno;
    } catch (error) {
      this.logger.error(error, SunoService);
      throw new BadRequestException('创建失败');
    }
  }

  async update(updateSunoDto: UpdateSunoDto) {
    const suno = await this.sunoRepository.findOneBy({
      id: updateSunoDto.id,
    });
    if (!suno) {
      throw new BadRequestException('更新失败');
    }
    suno.cookie = updateSunoDto.cookie;
    suno.credit = updateSunoDto.credit;
    suno.count = updateSunoDto.count;
    suno.status = updateSunoDto.status;
    suno.account = updateSunoDto.account;
    suno.password = updateSunoDto.password;
    suno.accountType = updateSunoDto.accountType;
    suno.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');

    try {
      await this.sunoRepository.update(
        {
          id: updateSunoDto.id,
        },
        suno,
      );
      return suno;
    } catch (error) {
      this.logger.error(error, SunoService);
      throw new BadRequestException('更新失败');
    }
  }

  async delete(id: number) {
    await this.sunoRepository.delete({
      id,
    });
  }

  async findSunosByPage(page: number, size: number, status: number) {
    const skipCount = (page - 1) * size;

    const condition: Record<string, any> = {};

    if (status !== undefined) {
      condition.status = Like(`%${status}%`);
    }

    const [records, total] = await this.sunoRepository.findAndCount({
      skip: skipCount,
      take: size,
      order: {
        createTime: 'DESC',
      },
      where: condition,
    });

    return {
      records,
      total,
      size,
      current: page,
    };
  }
}
