import { ApiProperty } from '@nestjs/swagger';

export class RecipeSearchDto {
  @ApiProperty()
  keyword: string;
}
