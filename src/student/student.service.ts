import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { News } from '../news/entities/news.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) { }

  async subscribe(school: number, user: number) {
    return this.subscriptionRepository.save({ school, user });
  }

  async findSubscribe(user: number) {
    return (await this.subscriptionRepository.find({ where: { user } } as FindManyOptions<Subscription>)).filter((subscribe) => !subscribe.deleted);
  }

  async deleteSubscribe(subscribe: number, user: number) {
    const subscribeRow = await this.subscriptionRepository.findOne({ where: { id: subscribe, user } } as FindOneOptions<Subscription>);

    if (subscribeRow) {
      subscribeRow.deleted = true;

      return this.subscriptionRepository.save(subscribeRow);
    }

    return [];
  }

  async news(school: number, user: number) {
    const subscribeRow = await this.subscriptionRepository.findOne({ where: { school, user, deleted: false } });

    if (subscribeRow) {
      return (await this.newsRepository.find({ where: { school }, order: { id: 'DESC' } })).filter((news) => !news.deleted);
    }

    return [];
  }
}
