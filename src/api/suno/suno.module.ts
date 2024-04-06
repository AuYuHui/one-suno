import { Module } from '@nestjs/common';
import { SunoService } from './suno.service';
import { SunoController } from './suno.controller';

@Module({
  controllers: [SunoController],
  providers: [SunoService],
})
export class SunoModule {}
