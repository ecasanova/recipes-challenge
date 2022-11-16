import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RecipeEntity } from './recipe.entity';

@Entity('images', { schema: 'public' })
export class ImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'xs', nullable: true })
  xs: string | null;

  @Column('text', { name: 'sm', nullable: true })
  sm: string | null;

  @Column('text', { name: 'md', nullable: true })
  md: string | null;

  @Column('text', { name: 'lg', nullable: true })
  lg: string | null;

  @ManyToOne(() => RecipeEntity, (recipe) => recipe.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'recipe_id', referencedColumnName: 'id' }])
  recipe: RecipeEntity;
}
