import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  school: number;

  @Column()
  content: string;

  @Column({ default: false })
  deleted: boolean;
}
