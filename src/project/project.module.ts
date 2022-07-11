import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { ProjectController } from './project.controller';
import { ProjectEntity } from './project.entity';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    ProjectEntity,
    UsersEntity
  ])],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}