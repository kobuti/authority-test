import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserAddress extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userAddressId: string;

  @Column({ nullable: false, type: 'varchar', length: 8 })
  zipCode: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  streetAddress: string;

  @Column({ nullable: false, type: 'varchar', length: 8 })
  buildNumber: string;

  @Column({ nullable: false, type: 'varchar', length: 30 })
  neighborhood: string;

  @Column({ nullable: false, type: 'varchar', length: 25 })
  city: string;

  @Column({ nullable: false, type: 'varchar', length: 2 })
  state: string;

  @OneToOne(() => User, (user) => user.userAddress)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
