import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/project/project.entity';
import { UserEntity } from 'src/user/user.entity';
import { TaskController } from './task.controller';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    TaskEntity,
    ProjectEntity,
    UserEntity
  ])],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
