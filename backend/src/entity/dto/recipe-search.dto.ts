import { ApiProperty } from '@nestjs/swagger';

export class RecipeSearchDto {
  @ApiProperty()
  keyword: string;

  @ApiProperty()
  areas: [id: string];

  @ApiProperty()
  ingredients: [id: string];

  @ApiProperty()
  categories: [id: string];
}
