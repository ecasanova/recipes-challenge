/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RecipeService } from './recipe.service';
import { RecipeSearchDto } from '../entity/dto/recipe-search.dto';
@ApiTags('recipe')
@ApiSecurity('apiKey')
@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Post('getAll')
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Body() search: RecipeSearchDto,
  ): Promise<any[]> {
    return await this.recipeService.getAll(page, limit, search);
  }

  @Get('getBySlug/:slug')
  async getBySlug(@Param('slug') slug: string): Promise<any> {
    return await this.recipeService.getBySlug(slug);
  }

  @Get('getCategories')
  async getCategories(): Promise<any> {
    return await this.recipeService.getCategories();
  }

  @Get('getAreas')
  async getAreas(): Promise<any> {
    return await this.recipeService.getAreas();
  }

  @Get('getIngredients')
  async getIngredients(): Promise<any> {
    return await this.recipeService.getIngredients();
  }

  @Get('loadData')
  async loadData(): Promise<any> {
    await this.recipeService.createBulkCategories();
    await this.recipeService.createBulkAreas();
    await this.recipeService.createBulkIngredients();
    await this.recipeService.createBulkRecipes();
  }
}
