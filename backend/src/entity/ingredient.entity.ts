import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
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

  @ManyToMany(() => RecipeEntity, (recipe) => recipe.ingredients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  recipes: RecipeEntity[];
}
