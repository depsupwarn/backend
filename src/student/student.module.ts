import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { News } from '../news/entities/news.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), TypeOrmModule.forFeature([News])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule { }
