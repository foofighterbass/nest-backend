import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './guards/auth.guard';
import { UsersController } from './user.controller';
import { UserEntity } from './user.entity';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    UserEntity,
  ])],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
  exports: [UsersService]
})
export class UsersModule {}