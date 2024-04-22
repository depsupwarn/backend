import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  school: number;

  @Column()
  user: number;

  @Column({ default: false })
  deleted: boolean;
}
