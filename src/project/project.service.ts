import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/createProject.dto';
import { ProjectEntity } from './project.entity';

@Injectable()
export class ProjectService {
    constructor(@InjectRepository(ProjectEntity) 
        private readonly projectRepository: Repository<ProjectEntity>
    ) {}

    async createProject(currentUser: UsersEntity, createProjectDto: CreateProjectDto): Promise<any> {
        const newProject = new ProjectEntity;
        Object.assign(newProject, createProjectDto);
        newProject.author = currentUser;
        newProject.slug = 'asd'
        
        return await this.projectRepository.save(newProject);
    }
}
