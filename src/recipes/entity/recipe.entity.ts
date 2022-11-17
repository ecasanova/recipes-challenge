import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { AreaEntity } from './area.entity';
import { CategoryEntity } from './category.entity';
import { ImageEntity } from './image.entity';
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

  @Column('text', { name: 'thumb', nullable: true })
  thumb: string | null;

  @OneToOne(() => ImageEntity, (image) => image.recipe, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  images: ImageEntity[];

  @OneToMany(() => IngredientEntity, (ingredient) => ingredient.recipe, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ingredients: IngredientEntity[];

  @ManyToOne(() => AreaEntity, (area) => area.recipes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'idArea', referencedColumnName: 'id' }])
  public idArea?: AreaEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.recipes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'idCategory', referencedColumnName: 'id' }])
  public idCategory?: CategoryEntity;
}
