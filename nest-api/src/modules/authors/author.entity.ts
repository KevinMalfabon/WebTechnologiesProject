import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, } from 'typeorm';

export type AuthorId = string;

@Entity('authors')
export class AuthorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar' , length: 255})
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' , length: 255})
  lastName: string;

  @Column({ name: 'information', type: 'varchar', length: 1000, nullable: true, default: '' })
  info?: string;

  //@Column({ name: 'book_count', type: 'int' })
  //bookCount: number | 0;
}