import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { ImageEntity } from './image.entity';

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

  @OneToOne(() => ImageEntity, (ImageEntity) => ImageEntity.recipe, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  images: ImageEntity;
}
