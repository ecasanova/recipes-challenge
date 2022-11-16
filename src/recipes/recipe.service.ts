import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RecipeEntity } from './entity/recipe.entity';
import { ImageEntity } from './entity/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
@Injectable()
export class RecipeService {
  constructor(
    @InjectRedis() private readonly cache: Redis,

    @InjectRepository(RecipeEntity)
    private readonly recipeRepo: Repository<RecipeEntity>,

    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,
  ) {}

  slugify(string) {
    return string
      .toString()
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
}
