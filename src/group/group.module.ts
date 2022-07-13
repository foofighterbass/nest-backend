import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/project/project.entity';
import { UserEntity } from 'src/user/user.entity';
import { GroupController } from './group.controller';
import { GroupEntity } from './group.entity';
import { GroupService } from './group.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    GroupEntity,
    ProjectEntity,
    UserEntity
  ])],
  controllers: [GroupController],
  providers: [GroupService]
})
export class GroupModule {}
