import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RecipeEntity } from './entity/recipe.entity';
import { ImageEntity } from './entity/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { CategoryEntity } from './entity/category.entity';
import { AreaEntity } from './entity/area.entity';
import { IngredientEntity } from './entity/ingredient.entity';
import { PassThrough } from 'stream';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const resizeImg = require('resize-image-buffer');
const imageSizes = [
  { name: 'xs', width: 120, heigth: 160 },
  { name: 'sm', width: 240, heigth: 320 },
  { name: 'md', width: 480, heigth: 640 },
  { name: 'lg', width: 680, heigth: 840 },
];
import { writeFileSync, createWriteStream } from 'fs';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRedis() private readonly cache: Redis,

    @InjectRepository(RecipeEntity)
    private readonly recipeRepo: Repository<RecipeEntity>,

    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,

    @InjectRepository(AreaEntity)
    private readonly areaRepo: Repository<AreaEntity>,

    @InjectRepository(IngredientEntity)
    private readonly ingredientRepo: Repository<IngredientEntity>,
  ) {}

  slugify(string) {
    return string
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  async getAll(page, limit, search): Promise<any> {
    const queryBuilder = await this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.images', 'images')
      .orderBy('recipe.name', 'ASC');

    queryBuilder.where('1=1');

    if (search.keyword) {
      queryBuilder.andWhere('recipe.name LIKE :keyword', {
        keyword: `%${search.keyword}%`,
      });
      queryBuilder.orWhere('recipe.description LIKE :keyword', {
        keyword: `%${search.keyword}%`,
      });
    }

    queryBuilder.orderBy('recipe.name', 'ASC');
    queryBuilder.skip(page * limit).take(limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    return {
      data: entities,
      totalItems: itemCount,
      currentPage: page,
      totalPages: Math.ceil(itemCount / limit),
    };
  }

  async getBySlug(slug: string): Promise<any> {
    const recipe = await this.cache.get(slug);
    if (recipe) return JSON.parse(recipe);

    const recipeEntity = await this.getRecipe({ slug });
    if (!recipeEntity) return {};

    await this.cache.set(
      slug,
      JSON.stringify(recipeEntity),
      'EX',
      process.env.CACHE_TTL,
    );
    return recipeEntity;
  }

  async getRecipe(params: any) {
    return await this.recipeRepo.findOne({
      where: {
        slug: params.slug,
      },
      relations: ['images'],
      withDeleted: true,
    });
  }

  async createBulkCategories(): Promise<any> {
    axios({
      method: 'GET',
      url: 'https://www.themealdb.com/api/json/v1/1/list.php?c=list',
    })
      .catch(() => {
        throw new ForbiddenException('API not available');
      })
      .then((res) => {
        const categories = res.data.meals;
        categories.forEach((category) => {
          this.createCategory(category);
        });
      });
  }

  async createBulkAreas(): Promise<any> {
    axios({
      method: 'GET',
      url: 'https://www.themealdb.com/api/json/v1/1/list.php?a=list',
    })
      .catch((error) => {
        throw new ForbiddenException(
          `API /list.php?a=list not available ${error}`,
        );
      })
      .then((res) => {
        const areas = res.data.meals;
        areas.forEach((area) => {
          this.createArea(area);
        });
      });
  }

  async createBulkIngredients(): Promise<any> {
    axios({
      method: 'GET',
      url: 'https://www.themealdb.com/api/json/v1/1/list.php?i=list',
    })
      .catch((error) => {
        throw new ForbiddenException(
          `API /list.php?i=list not available ${error}`,
        );
      })
      .then((res) => {
        const ingredients = res.data.meals;
        ingredients.forEach((ingredient) => {
          this.createIngredient(ingredient);
        });
      });
  }

  async getRecipesByCategory(category: string): Promise<any> {
    return await axios({
      method: 'GET',
      url: `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
    })
      .catch((error) => {
        throw new ForbiddenException(
          `API /filter.php?c=${category} not available: ${error}`,
        );
      })
      .then((res) => {
        return res.data.meals;
      });
  }

  async getRecipesById(id: string): Promise<any> {
    return await axios({
      method: 'GET',
      url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    })
      .catch((error) => {
        throw new ForbiddenException(
          `API /lookup.php?i=${id} not available: ${error}`,
        );
      })
      .then((res) => {
        return res.data.meals;
      });
  }

  async delay(t) {
    return new Promise((resolve) => setTimeout(resolve, t));
  }

  async createBulkRecipes(): Promise<any> {
    const categories = await this.categoryRepo.find({
      take: 1,
    });
    let inserts = 0;
    try {
      await categories.forEach(async (category) => {
        //console.log(`Looking for al recipes of: ${category.name}`);
        await this.delay(1000);
        await this.getRecipesByCategory(category.name).then(
          async (recipeList) => {
            await recipeList.forEach(async (recipe) => {
              await this.delay(1000);
              try {
                //console.log(`Looking details of ${recipe.idMeal}`);
                await this.getRecipesById(recipe.idMeal).then(
                  async (recipeDetail) => {
                    //console.log(`Insert on dabase ${recipeDetail[0].idMeal}`);
                    if (inserts < 1) {
                      await this.createRecipe(recipeDetail[0]);
                    }
                    inserts++;
                  },
                );
              } catch (error) {
                return {
                  result: 'error',
                  message: `Error cargando ${recipe.idMeal}`,
                };
              }
            });
          },
        );
        return { result: 'success', inserts: inserts };
      });
    } catch (e) {
      return { result: 'error', inserts: inserts, error: e };
    }
  }

  async downloadImage(dest, size, slug): Promise<any> {
    const filename = 'uploads/' + slug + '.jpg';

    return new Promise((resolve, reject) => {
      try {
        axios
          .get(dest, { responseType: 'stream' })
          .then(async (response) => {
            try {
              response.data.pipe(createWriteStream(filename));
              console.log(`Image ${filename} downloaded to ${size.name}`);
              resolve(true);
            } catch (error) {
              console.log(error);
            }
          })
          .catch((error) => {
            console.log('Error loading thumbs of ', slug, size.name);
            reject();
          });
      } catch (error) {
        console.log('Error loading thumbs ', slug, size.name);
        reject();
      }
    });
  }

  async createCategory(category: any): Promise<any> {
    const categoryEntity = new CategoryEntity();
    categoryEntity.name = category.strCategory;
    await this.categoryRepo.insert(categoryEntity);
  }

  async createArea(area: any): Promise<any> {
    const areaEntity = new AreaEntity();
    areaEntity.name = area.strArea;
    await this.areaRepo.insert(areaEntity);
  }

  async createIngredient(area: any): Promise<any> {
    const ingredientEntity = new IngredientEntity();
    ingredientEntity.name = area.strIngredient;
    await this.ingredientRepo.insert(ingredientEntity);
  }

  async createRecipe(recipe: any): Promise<any> {
    try {
      const recipeEntity = new RecipeEntity();
      const slug = this.slugify(recipe.strMeal);
      await this.deleteBySlug(slug);
      recipeEntity.name = recipe.strMeal;
      recipeEntity.description = recipe.strInstructions;
      recipeEntity.slug = slug;
      recipeEntity.youtube = recipe.strYoutube;
      recipeEntity.source = recipe.strSource;
      recipeEntity.thumb = recipe.strMealThumb;
      recipeEntity.idCategory = await this.categoryRepo.findOne({
        where: {
          name: recipe.strCategory,
        },
      });
      recipeEntity.idArea = await this.areaRepo.findOne({
        where: {
          name: recipe.strArea,
        },
      });

      await imageSizes.forEach(async (size) => {
        await this.downloadImage(recipe.strMealThumb, size, slug);
      });

      return await this.recipeRepo.insert(recipeEntity);
    } catch (e) {
      throw new ForbiddenException('Error creating recipe');
    }
  }

  async deleteBySlug(slug: string): Promise<any> {
    const recipe = await this.recipeRepo.findOne({ where: { slug: slug } });
    if (recipe) {
      await this.recipeRepo.delete(recipe.id);
      return { result: 'success', message: 'Recipe deleted' };
    } else {
      return { result: 'error', message: 'Recipe not found' };
    }
  }
}
