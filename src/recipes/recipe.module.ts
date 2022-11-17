import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './entity/recipe.entity';
import { RecipeService } from './recipe.service';
import { ImageEntity } from './entity/image.entity';
import { AreaEntity } from './entity/area.entity';
import { CategoryEntity } from './entity/category.entity';
import { IngredientEntity } from './entity/ingredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeEntity,
      ImageEntity,
      AreaEntity,
      CategoryEntity,
      IngredientEntity,
    ]),
  ],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService, TypeOrmModule],
})
export class RecipeModule {}
