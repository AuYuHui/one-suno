import {
  Controller,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Get,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { SunoService } from './suno.service';
import { CreateSunoDto } from './dto/create-suno.dto';
import { RequireLogin } from 'src/custom.decorator';
import { UpdateSunoDto } from './dto/update-suno.dto';
import { generateParseIntPipe } from 'src/utils';

@Controller('admin/suno')
export class SunoController {
  constructor(private readonly sunoService: SunoService) {}

  @Post()
  @RequireLogin()
  async create(@Body() createSunoDto: CreateSunoDto) {
    return await this.sunoService.create(createSunoDto);
  }

  // 更新 suno
  @Put()
  @RequireLogin()
  async update(@Body() updateSunoDto: UpdateSunoDto) {
    return await this.sunoService.update(updateSunoDto);
  }

  // 删除 suno 账号
  @Delete(':id')
  @RequireLogin()
  async delete(@Param('id') id: number) {
    return await this.sunoService.delete(id);
  }

  // 获取 suno 列表
  @Get('list')
  @RequireLogin()
  async list(
    @Query('current', new DefaultValuePipe(1), generateParseIntPipe('current'))
    current: number,
    @Query('size', new DefaultValuePipe(10), generateParseIntPipe('size'))
    size: number,
    @Query('status')
    status: number,
  ) {
    return await this.sunoService.findSunosByPage(current, size, status);
  }
}
