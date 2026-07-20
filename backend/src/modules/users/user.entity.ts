import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

// Relations (lazy — avoid circular imports)
// import { Category } from '../categories/category.entity';
// import { Transaction } from '../transactions/transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', name: 'password_hash' })
  passwordHash!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // TODO: uncomment once entities are created
  // @OneToMany(() => Category, (category) => category.user)
  // categories!: Category[];

  // @OneToMany(() => Transaction, (transaction) => transaction.user)
  // transactions!: Transaction[];
}
