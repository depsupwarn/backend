import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
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

  async deleteSubscribe(subscribe: number, user: number) {
    const subscribeRow = await this.subscriptionRepository.findOne({ where: { id: subscribe, user } } as FindOneOptions<Subscription>);

    if (subscribeRow) {
      subscribeRow.deleted = true;

      return this.subscriptionRepository.save(subscribeRow);
    }

    return null;
  }
}
