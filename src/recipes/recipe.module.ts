import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './entity/recipe.entity';
import { RecipeService } from './recipe.service';
import { ImageEntity } from './entity/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeEntity, ImageEntity])],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService, TypeOrmModule],
})
export class RecipeModule {}
