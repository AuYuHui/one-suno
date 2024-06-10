import { Module } from '@nestjs/common';
import { SunoModule } from './suno/suno.module';

@Module({
  imports: [SunoModule],
})
export class ApiModule {}
