// Vendor
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

// Src
import { Role } from './role.entity';

@Unique(['email', 'username'])
@Entity('user', { schema: 'be' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { nullable: false })
  email: string;

  @Column('varchar')
  phone: string;

  @Column('varchar', { nullable: false })
  username: string;

  @Column('varchar')
  password: string;

  @Column('int')
  age: number;

  /**
   * m - male
   * f - female
   * u - unspecified
   */
  @Column({ type: 'enum', enum: ['m', 'f', 'u'] })
  gender: string;

  @Column('varchar')
  bsalt: string;

  @Column('varchar', { name: 'email_verify_token', nullable: false })
  emailVerifyToken: string;

  @Column('varchar', { name: 'reset_password_token', nullable: false })
  resetPasswordToken: string;

  @Column('varchar', { name: 'refresh_token', nullable: true, default: null })
  refreshToken: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  deletedAt: Date;

  @Column('boolean', { name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  createdBy: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: number;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Promise<Role[]>;
}
