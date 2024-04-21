import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';

@UseGuards(RolesGuard)
@Roles(Role.Admin)
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post()
  async create(@Body() createNewsDto: CreateNewsDto) {
    return await this.newsService.create(createNewsDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
