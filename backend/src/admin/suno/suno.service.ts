import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateSunoDto } from './dto/create-suno.dto';
import { Suno } from './entities/suno.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UpdateSunoDto } from './dto/update-suno.dto';
import dayjs from 'dayjs';

@Injectable()
export class SunoService {
  private logger = new Logger();
  @InjectRepository(Suno)
  private sunoRepository: Repository<Suno>;

  async create(createSunoDto: CreateSunoDto) {
    const suno = new Suno();
    suno.cookie = createSunoDto.cookie;
    suno.credit = createSunoDto.credit;
    suno.count = createSunoDto.count;
    suno.status = createSunoDto.status;

    try {
      await this.sunoRepository.save(suno);
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
