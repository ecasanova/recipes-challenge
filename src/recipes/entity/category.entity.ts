import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RecipeEntity } from './recipe.entity';

@Entity('category', { schema: 'public' })
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'name', nullable: false, unique: true })
  name: string | null;

  @OneToMany(() => RecipeEntity, (recipe) => recipe.idCategory)
  public recipes?: RecipeEntity[];
}
