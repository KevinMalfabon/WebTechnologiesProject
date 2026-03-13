import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SaleEntity } from '../sales/sale.entity';

@Entity({ name: 'clients' })
export class ClientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120 })
  firstName: string;

  @Column({ type: 'varchar', length: 120 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  picture: string | null;

  @OneToMany(() => SaleEntity, (sale) => sale.client)
  sales: SaleEntity[];

  purchasedBooksCount?: number;
}
