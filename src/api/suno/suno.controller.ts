import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SunoService } from './suno.service';
import { CreateCustomMusicDto } from './dto/create-suno.dto';

@Controller('suno')
export class SunoController {
  constructor(private readonly sunoService: SunoService) {}

  @Post('/generate/lyrics')
  generateLyrics() {
    return this.sunoService.generateLyrics();
  }

  @Get('/lyrics')
  getLyrics(@Query('id') id: string) {
    return this.sunoService.getLyrics(id);
  }

  @Post('/generate/music')
  generateMusic(@Body() customMusic: CreateCustomMusicDto) {
    return this.sunoService.generateMusic(customMusic);
  }
}
