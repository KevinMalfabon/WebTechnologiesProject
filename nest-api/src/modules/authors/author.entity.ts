import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, } from 'typeorm';

export type AuthorId = string & { __brand: 'Author' };

@Entity('authors')
export class AuthorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: AuthorId;

  @Column({ name: 'first_name', type: 'varchar' , length: 255})
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' , length: 255})
  lastName: string;

  @Column({ name: 'information', type: 'varchar' , length: 1000})
  info: string;

  //@Column({ name: 'book_count', type: 'int' })
  //bookCount: number | 0;
}
