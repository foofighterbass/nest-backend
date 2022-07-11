import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/createProject.dto';
import { ProjectEntity } from './project.entity';
import slugify from 'slugify';
import { UpdateProjectDto } from './dto/updateProject.dto';

@Injectable()
export class ProjectService {
    constructor(@InjectRepository(ProjectEntity) 
        private readonly projectRepository: Repository<ProjectEntity>
    ) {}

    async createProject(currentUser: UsersEntity, createProjectDto: CreateProjectDto): Promise<any> {
        const newProject = new ProjectEntity;
        Object.assign(newProject, createProjectDto);
        newProject.author = currentUser;
        newProject.slug = this.getSlug(createProjectDto.title)

        return await this.projectRepository.save(newProject);
    }

    async findBySlug(slug: string): Promise<any> {
        return this.projectRepository.findOneBy({slug});
    }

    async deleteProject(currentUserId: number, slug: string): Promise<DeleteResult> {
        const project = await this.findBySlug(slug);

        if (!project) {
            throw new HttpException('Project does not exist', HttpStatus.NOT_FOUND);
        }
        if (project.author.id !== currentUserId) {
            throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
        }
        return await this.projectRepository.delete({ slug })
    }

    async updateProject(
        currentUserId: number, 
        updateProjectDto: UpdateProjectDto, 
        slug: string): 
    Promise<any> {
        const project = await this.findBySlug(slug);

        if (!project) {
            throw new HttpException('Project does not exist', HttpStatus.NOT_FOUND);
        }
        if (project.author.id !== currentUserId) {
            throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
        }
        Object.assign(project, updateProjectDto);
        return await this.projectRepository.save(project);
    }
 
    buildProjectResponse(project: ProjectEntity) {
        return { project  }
    }

    private getSlug(title: string) {
        return slugify(title, {
            lower: true
        }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    }
}