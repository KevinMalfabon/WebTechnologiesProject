import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, column } from 'typeorm';

export type AuthorId = string & { __brand: 'Author' };

@Entity('authors')
export class AuthorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: AuthorId;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName: string;

  @Column({ name: 'information', type: 'varchar' })
  info: string;

  @Column({ name: 'book_count', type: 'int' })
  
  bookCount: number | 0;
}
