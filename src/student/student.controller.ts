import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { Request } from 'express';

@UseGuards(RolesGuard)
@Roles(Role.User)
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @Post('subscribe')
  async subscribe(@Req() req: Request, @Query('school') school: string) {
    return await this.studentService.subscribe(+school, req["user"].id);
  }

  @Get('subscribe')
  async findSubscribe(@Req() req: Request) {
    return await this.studentService.findSubscribe(req["user"].id);
  }

  @Delete('subscribe')
  async deleteSubscribe(@Req() req: Request, @Query('id') subscribe: string) {
    return await this.studentService.deleteSubscribe(+subscribe, req["user"].id);
  }

  @Get('news')
  async news(@Req() req: Request, @Query('school') school: string) {
    return await this.studentService.news(+school, req["user"].id);
  }
}
