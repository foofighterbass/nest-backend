import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from 'src/users/decorators/users.decorator';
import { AuthGuard } from 'src/users/guards/auth.guard';
import { UsersEntity } from 'src/users/users.entity';
import { CreateProjectDto } from './dto/createProject.dto';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post()
    @UsePipes(new ValidationPipe)
    @UseGuards(AuthGuard)
    async createProject(
        @User() currentUser: UsersEntity,
        @Body('project') createProjectDto: CreateProjectDto): 
    Promise<any> {
        const project = await this.projectService.createProject(currentUser, createProjectDto);
        return this.projectService.buildProjectResponse(project);
    }

    @Get(':slug')
    async getSingleProject(@Param('slug') slug: string): Promise<any> {
        const project = await this.projectService.findBySlug(slug);
        return this.projectService.buildProjectResponse(project);
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticle(
        @User('id') currentUserId: number,
        @Param('slug') slug: string): 
    Promise<any> {
        return await this.projectService.deleteProject(currentUserId, slug);
    }
}
