import { ApiProperty } from '@nestjs/swagger';

export class RecipeSearchDto {
  @ApiProperty()
  keyword: string;

  @ApiProperty()
  area: string;

  @ApiProperty()
  ingredient: string;

  @ApiProperty()
  category: string;
}
