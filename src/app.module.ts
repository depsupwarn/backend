import { Module } from '@nestjs/common';
import { SchoolsModule } from './schools/schools.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.NODE_ENV === 'development' ? 'dev.db' : 'test.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    SchoolsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
