import { Module } from '@nestjs/common';
import { SunoService } from './suno.service';
import { SunoController } from './suno.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suno } from './entities/suno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Suno])],
  controllers: [SunoController],
  providers: [SunoService],
})
export class SunoModule {}
