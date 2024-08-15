import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column('text')
  password: string;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @Column({ default: true })
  isActive: boolean;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.username = this.username.toLocaleLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.username = this.username.toLocaleLowerCase().trim();
  }
}
