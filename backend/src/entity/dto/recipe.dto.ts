import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Unique } from 'typeorm';
import { ImageEntityDto } from './image.dto';

export class RecipeDto {
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  images: ImageEntityDto;
}
