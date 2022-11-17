import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RecipeEntity } from './recipe.entity';

@Entity('area', { schema: 'public' })
export class AreaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { name: 'name', nullable: false, unique: true })
  name: string | null;

  @OneToMany(() => RecipeEntity, (recipe) => recipe.area)
  public recipes?: RecipeEntity[];
}
