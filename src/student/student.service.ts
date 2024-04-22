import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
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

  async findSubscribe(user: number) {
    return (await this.subscriptionRepository.find({ user } as FindManyOptions<Subscription>)).filter((subscribe) => !subscribe.deleted);
  }
}
