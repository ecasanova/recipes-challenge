import { ForbiddenException, Injectable } from '@nestjs/common';
import { RecipeEntity } from '../entity/recipe.entity';
import { CategoryEntity } from '../entity/category.entity';
import { AreaEntity } from '../entity/area.entity';
import { IngredientEntity } from '../entity/ingredient.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { createWriteStream, existsSync } from 'fs';
import Redis from 'ioredis';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
const IMAGE_PATH = 'static/';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRedis() private readonly cache: Redis,

    @InjectRepository(RecipeEntity)
    private readonly recipeRepo: Repository<RecipeEntity>,

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
      .leftJoinAndSelect('recipe.area', 'area')
      .leftJoinAndSelect('recipe.category', 'category')
      .orderBy('area.name', 'ASC');

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
      relations: ['area', 'category', 'ingredients'],
    });
  }

  async createBulkCategories(): Promise<any> {
    console.log(`------------------------------------------------------`);
    console.log('Importing categories...');
    return await axios({
      method: 'GET',
      url: 'https://www.themealdb.com/api/json/v1/1/list.php?c=list',
    })
      .catch(() => {
        throw new ForbiddenException('API not available');
      })
      .then((res) => {
        const categories = res.data.meals;
        categories.forEach(async (category) => {
          await this.createCategory(category);
        });
      });
  }

  async createBulkAreas(): Promise<any> {
    console.log(`------------------------------------------------------`);
    console.log('Importing areas...');
    await axios({
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
        areas.forEach(async (area) => {
          await this.createArea(area);
        });
      });
  }

  async createBulkIngredients(): Promise<any> {
    console.log(`------------------------------------------------------`);
    console.log('Importing ingredients...');
    return await axios({
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
        ingredients.forEach(async (ingredient) => {
          await this.createIngredient(ingredient);
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
    console.log(`------------------------------------------------------`);
    console.log('Importing recipes...');
    const categories = await this.categoryRepo.find({});
    try {
      return await categories.forEach(async (category) => {
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
                    await this.createRecipe(recipeDetail[0]);
                  },
                );
              } catch (error) {
                return {
                  result: 'error',
                  message: `Error loading ${recipe.idMeal}`,
                };
              }
            });
          },
        );
        return { result: 'success' };
      });
    } catch (e) {
      return { result: 'error', error: e };
    }
  }

  //TODO: This images can be stored in s3 bucker
  async downloadImage(dest, slug): Promise<any> {
    const original_filename = IMAGE_PATH + slug + '.jpg';

    return new Promise((resolve, reject) => {
      try {
        axios
          .get(dest, { responseType: 'stream' })
          .then(async (response) => {
            try {
              if (!existsSync(original_filename)) {
                await response.data.pipe(createWriteStream(original_filename));
                console.log(
                  `Original image ${original_filename} downloaded successfully`,
                );
              }
              resolve(true);
            } catch (error) {
              console.log(error);
            }
          })
          .catch((error) => {
            console.log('Error loading image: ', slug);
            reject();
          });
      } catch (error) {
        console.log('Error loading image ', slug);
        reject();
      }
    });
  }

  async createCategory(category: any): Promise<any> {
    //Check if category already exists
    let categoryEntity = await this.categoryRepo.findOne({
      where: { name: category.strCategory },
    });
    if (categoryEntity) {
      console.log(`Category ${category.strCategory} already exists`);
      return categoryEntity;
    }
    categoryEntity = new CategoryEntity();
    categoryEntity.name = category.strCategory;
    console.log(`Inserting category ${category.strCategory}`);
    return await this.categoryRepo.insert(categoryEntity);
  }

  async createArea(area: any): Promise<any> {
    //Check if area already exists
    let areaEntity = await this.areaRepo.findOne({
      where: {
        name: area.strArea,
      },
    });
    if (areaEntity) {
      console.log(`Area ${area.strArea} already exists`);
      return areaEntity;
    }
    areaEntity = new AreaEntity();
    areaEntity.name = area.strArea;
    console.log(`Inserting area ${area.strArea}`);
    return await this.areaRepo.insert(areaEntity);
  }

  async createIngredient(ingredient: any): Promise<any> {
    //Check if ingredient already exists
    let ingredientEntity = await this.ingredientRepo.findOne({
      where: {
        name: ingredient.strIngredient1,
      },
    });
    if (ingredientEntity) {
      console.log(`Ingredient ${ingredient.strIngredient} already exists`);
      return ingredientEntity;
    }
    ingredientEntity = new IngredientEntity();
    ingredientEntity.name = ingredient.strIngredient;
    console.log(`Inserting ingredient ${ingredient.strIngredient}`);
    return await this.ingredientRepo.insert(ingredientEntity);
  }

  async createRecipe(recipe: any): Promise<any> {
    const slug = this.slugify(recipe.strMeal);
    //Check if recipe already exists
    let recipeEntity = await this.recipeRepo.findOne({
      where: {
        slug: slug,
      },
    });
    if (recipeEntity) {
      this.recipeRepo.delete(recipeEntity.id);
    }
    try {
      recipeEntity = new RecipeEntity();
      recipeEntity.name = recipe.strMeal;
      recipeEntity.description = recipe.strInstructions;
      recipeEntity.slug = slug;
      recipeEntity.youtube = recipe.strYoutube;
      recipeEntity.source = recipe.strSource;
      recipeEntity.image = IMAGE_PATH + slug + '.jpg';
      recipeEntity.category = await this.categoryRepo.findOne({
        where: {
          name: recipe.strCategory,
        },
      });
      recipeEntity.area = await this.areaRepo.findOne({
        where: {
          name: recipe.strArea,
        },
      });

      const ingredient1: IngredientEntity = await this.ingredientRepo.findOne({
        where: {
          name: recipe.strIngredient1,
        },
      });
      const ingredient2: IngredientEntity = await this.ingredientRepo.findOne({
        where: {
          name: recipe.strIngredient2,
        },
      });
      const ingredient3: IngredientEntity = await this.ingredientRepo.findOne({
        where: {
          name: recipe.strIngredient3,
        },
      });
      const ingredient4: IngredientEntity = await this.ingredientRepo.findOne({
        where: {
          name: recipe.strIngredient4,
        },
      });
      const ingredient5: IngredientEntity = await this.ingredientRepo.findOne({
        where: {
          name: recipe.strIngredient5,
        },
      });
      const ingredient6: IngredientEntity = await this.ingredientRepo.findOne({
        where: {
          name: recipe.strIngredient6,
        },
      });

      recipeEntity.ingredients = [
        ingredient1,
        ingredient2,
        ingredient3,
        ingredient4,
        ingredient5,
        ingredient6,
      ];
      console.log('Inserting recipe:', recipeEntity.name);
      return await this.recipeRepo.create(recipeEntity);
    } catch (e) {
      throw new ForbiddenException('Error creating recipe');
    }
  }
}
