import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { SubtaskController } from './subtask.controller';
import { SubtaskEntity } from './subtask.entity';
import { SubtaskService } from './subtask.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    SubtaskEntity,
    UserEntity
  ])],
  controllers: [SubtaskController],
  providers: [SubtaskService]
})
export class SubtaskModule {}
