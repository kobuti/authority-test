import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserAddress extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
