import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) { }

  async create(createNewsDto: CreateNewsDto) {
    return await this.newsRepository.save(createNewsDto);
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    return await this.newsRepository.save({ id, ...updateNewsDto });
  }

  async remove(id: number) {
    return await this.newsRepository.save({ id, deleted: true });
  }
}
