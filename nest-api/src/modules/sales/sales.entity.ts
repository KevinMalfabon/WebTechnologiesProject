import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { BookEntity, type BookId } from '../books/entities/book.entity';

export type SaleId = string & { __brand: 'Sale' };

@Entity({ name: 'sales' })
export class SaleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: SaleId;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @CreateDateColumn({ name: 'sale_date' })
  saleDate: Date;

  @Column({ name: 'book_id', type: 'uuid' })
  bookId: BookId;

  @ManyToOne(() => BookEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;
}
