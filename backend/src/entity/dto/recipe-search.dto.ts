import { ApiProperty } from '@nestjs/swagger';

export class RecipeSearchDto {
  @ApiProperty()
  areas: [id: string];

  @ApiProperty()
  ingredients: [id: string];

  @ApiProperty()
  categories: [id: string];
}
