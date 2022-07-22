import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from 'src/user/decorators/users.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { StatusTaskDto } from './dto/statusTask.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {

    constructor(private readonly taskService: TaskService) {}


    @Post('create')//create new task
    @UsePipes(new ValidationPipe)
    @UseGuards(AuthGuard)
    async createTask(
        @User() currentUser: UserEntity,
        @Query() query: any,
        @Body('task') createTaskDto: CreateTaskDto): 
    Promise<any> {
        const group = await this.taskService.createTask(currentUser, query, createTaskDto);
        return this.taskService.buildTaskResponse(group);
    }


    @Get()
    async findTask(@Query() query: any): Promise<any> {
        const group = await this.taskService.findTask(query)
        return await this.taskService.buildTaskResponse(group);
    }


    @Get('list')
    async allTasks(@Query() query: any): Promise<any> {
        return await this.taskService.allTasks(query);
    }


    @Post('addmember')
    @UseGuards(AuthGuard)
    async addMember(
        @Body('email') email: string,
        @Query() query: any): 
    Promise<any> {
        return await this.taskService.addMember(email, query)
    }


    @Get('members')
    @UseGuards(AuthGuard)
    async allMembers(
        @Query() query: any):
    Promise<any> {
        return await this.taskService.allMembers(query);
    }


    @Post('status')
    @UsePipes(new ValidationPipe)
    async taskStatus(
        @Query() query: any,
        @Body('task') statusTaskDto: StatusTaskDto): 
    Promise<any> {
        return await this.taskService.taskStatus(query, statusTaskDto);
    }
}