import { PartialType } from '@nestjs/mapped-types';
import { CreateSunoDto } from './create-suno.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateSunoDto extends PartialType(CreateSunoDto) {
  @IsNotEmpty({
    message: 'id 不能为空',
  })
  id: number;
}
