import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthorEntity, type AuthorId } from '../../authors/author.entity';
import { SaleEntity } from '../../sales/sale.entity';

export type BookId = string & { __brand: 'Book' };

@Entity('books')
export class BookEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: BookId;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'year_published', type: 'int' })
  yearPublished: number;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId: AuthorId;

  @ManyToOne(() => AuthorEntity, { onDelete: 'CASCADE' })
  
  @JoinColumn({ name: 'author_id' })
  author: AuthorEntity;

  @Column({ name: 'cover_url', type: 'varchar', nullable: true })
  coverUrl?: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description?: string;

  @OneToMany(() => SaleEntity, (sale) => sale.book)
  sales: SaleEntity[];

  salesCount?: number;
}
