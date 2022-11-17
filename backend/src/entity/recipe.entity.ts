import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { AreaEntity } from './area.entity';
import { CategoryEntity } from './category.entity';
import { IngredientEntity } from './ingredient.entity';

@Entity('recipe', { schema: 'public' })
export class RecipeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'name', nullable: false })
  name: string | null;

  @Column('text', { name: 'slug', nullable: false, unique: true })
  slug: string;

  @Column('text', { name: 'description', nullable: true })
  description: string | null;

  @Column('text', { name: 'youtube', nullable: true })
  youtube: string | null;

  @Column('text', { name: 'source', nullable: true })
  source: string | null;

  @Column('text', { name: 'image', nullable: true })
  image: string | null;

  @ManyToMany(() => IngredientEntity, (ingredient) => ingredient.recipes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @JoinTable()
  ingredients: IngredientEntity[];

  @ManyToOne(() => AreaEntity, (area) => area.recipes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'areaId', referencedColumnName: 'id' }])
  public area?: AreaEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.recipes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'categoryId', referencedColumnName: 'id' }])
  public category?: CategoryEntity;
}
