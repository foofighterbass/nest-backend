import { Body, Controller, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from 'src/user/decorators/users.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { CreateTaskDto } from './dto/createTask.dto';
import { StatusTaskDto } from './dto/statusTask.dto';
import { TaskService } from './task.service';

@Controller(':slug/:groupid')
export class TaskController {

    constructor(private readonly taskService: TaskService) {}


    @Post('task/create')//create new task
    @UsePipes(new ValidationPipe)
    @UseGuards(AuthGuard)
    async createTask(
        @User() currentUser: UserEntity,
        @Param('slug') slug: string,
        @Param('groupid') groupId: string,
        @Body('task') createTaskDto: CreateTaskDto): 
    Promise<any> {
        const group = await this.taskService.createTask(currentUser, slug, groupId, createTaskDto);
        return this.taskService.buildTaskResponse(group);
    }


    @Get('task')
    async findTask(@Query() query: any): Promise<any> {
        const group = await this.taskService.findTask(query)
        return await this.taskService.buildTaskResponse(group);
    }


    @Get('task/all')
    async allTasks(
        @Param('slug') slug: string,
        @Param('groupid') groupId: string): 
    Promise<any> {
        return await this.taskService.allTasks(slug, groupId);
    }


    @Post(':taskid/addmember')
    @UseGuards(AuthGuard)
    async addMember(
        @Body('email') email: string,
        @Param('taskid') taskId: string): 
    Promise<any> {
        return await this.taskService.addMember(email, taskId)
    }
 

    @Get(':taskid/allmembers')
    @UseGuards(AuthGuard)
    async allMembers(
        @Param('taskid') taskId: string):
    Promise<any> {
        return await this.taskService.allMembers(taskId);
    }


    @Post(':taskid/chst')
    @UsePipes(new ValidationPipe)
    async taskStatus(
        @Param('taskid') taskId: string,
        @Body('task') statusTaskDto: StatusTaskDto): 
    Promise<any> {
        return await this.taskService.taskStatus(taskId, statusTaskDto);
    }
}