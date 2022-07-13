import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { ProjectController } from './project.controller';
import { ProjectEntity } from './project.entity';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    ProjectEntity,
    UserEntity
  ])],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}