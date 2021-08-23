import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserAddress } from './user.address.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  name: string;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserAddress, (user) => user.user, {
    cascade: true,
  })
  @JoinColumn()
  userAddress: UserAddress;
}
