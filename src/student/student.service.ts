import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../subscriptions/entities/subscription.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) { }

  async subscribe(school: number, user: number) {
    return this.subscriptionRepository.save({ school, user });
  }
}
