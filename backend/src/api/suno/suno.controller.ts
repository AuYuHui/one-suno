import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SunoService } from './suno.service';
import { CreateCustomMusicDto, CreateLyricsDto } from './dto/create-suno.dto';

@Controller('suno')
export class SunoController {
  constructor(private readonly sunoService: SunoService) {}

  @Post('/generate/lyrics')
  generateLyrics(@Body() prompt: CreateLyricsDto) {
    return this.sunoService.generateLyrics(prompt);
  }

  @Get('/lyrics')
  getLyrics(@Query('id') id: string) {
    return this.sunoService.getLyrics(id);
  }

  @Post('/generate/music')
  generateMusic(@Body() customMusic: CreateCustomMusicDto) {
    return this.sunoService.generateMusic(customMusic);
  }

  @Get('/music')
  getMusic(@Query('ids') ids: string) {
    return this.sunoService.getMusic(ids);
  }
}
