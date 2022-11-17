import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecipeEntity } from './recipe.entity';

@Entity('ingredient', { schema: 'public' })
export class IngredientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'name', nullable: true, unique: true })
  name: string | null;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'idRecipe', referencedColumnName: 'id' }])
  recipe: RecipeEntity;
}
