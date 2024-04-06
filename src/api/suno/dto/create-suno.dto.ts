import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateCustomMusicDto {
  @ApiProperty({
    description: 'The text prompt to generate audio from.',
    default: '',
  })
  @IsString()
  prompt: string;

  @ApiProperty({ description: 'The title for the generated audio.' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Tags to categorize the generated audio.' })
  @IsString()
  tags: string;

  @ApiPropertyOptional({
    description: 'continue a new clip from a previous song, format mm:ss',
  })
  @IsOptional()
  @IsString()
  continueAt?: string;

  @IsOptional()
  @IsString()
  continueClipId?: string;

  @ApiPropertyOptional({
    description: 'model version, default: chirp-v3-0',
    enum: ['chirp-v3-0', 'chirp-v2-xxl-alpha'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['chirp-v3-0', 'chirp-v2-xxl-alpha'])
  model?: string;
}

export class CreateDescriptionModeMusicDto {
  @ApiPropertyOptional({ description: 'Prompt for GPT description' })
  @IsOptional()
  @IsString()
  gpt_description_prompt?: string;

  @ApiPropertyOptional({
    description: 'Placeholder, keep it as an empty string, do not modify it',
  })
  @IsOptional()
  @IsBoolean()
  prompt?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the generated audio should be instrumental.',
  })
  @IsOptional()
  @IsBoolean()
  make_instrumental?: boolean = false;

  @ApiPropertyOptional({
    description: 'model version, default: chirp-v3-0',
    enum: ['chirp-v3-0', 'chirp-v2-xxl-alpha'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['chirp-v3-0', 'chirp-v2-xxl-alpha'])
  mv?: string;
}
