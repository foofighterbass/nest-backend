import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/createProject.dto';
import { ProjectEntity } from './project.entity';
import slugify from 'slugify';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { AppDataSource } from 'src/AppDataSource'
import { toJSON } from 'flatted';


@Injectable()
export class ProjectService {

    constructor(
        @InjectRepository(ProjectEntity) 
            private readonly projectRepository: Repository<ProjectEntity>,
        @InjectRepository(UserEntity) 
            private readonly userRepository: Repository<UserEntity>
    ) {}


    async createProject(currentUser: UserEntity, createProjectDto: CreateProjectDto): Promise<any> {
        const newProject = new ProjectEntity;
        
        Object.assign(newProject, createProjectDto);
        newProject.authorOfProject = currentUser;
        newProject.slug = this.getSlug(createProjectDto.title)

        return await this.projectRepository.save(newProject);
    }

 
    async findBySlug(slug: string) {
        return this.projectRepository.findOneBy({slug});
    }


    async deleteProject(currentUserId: number, slug: string): Promise<DeleteResult> {
        const project = await this.findBySlug(slug);

        if (!project) {
            throw new HttpException('Project does not exist', HttpStatus.NOT_FOUND);
        }
        if (project.authorOfProject.id !== currentUserId) {
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
        if (project.authorOfProject.id !== currentUserId) {
            throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
        }
        console.log(project)
        Object.assign(project, updateProjectDto);
        return await this.projectRepository.save(project);
    }


    async allProjects(query: any): Promise<any> {
        const queryBuilder = AppDataSource
            .getRepository(ProjectEntity)
            .createQueryBuilder('projects')
            .leftJoinAndSelect('projects.authorOfProject', 'author');

        queryBuilder.orderBy('projects.createdAt', 'DESC');
        const projectsCount = await queryBuilder.getCount();
        if (query.author) {
            const author = await this.userRepository.findOneBy({
                name: query.author
            });
            if (!author) {
                throw new HttpException('Projects of user not found', HttpStatus.NOT_FOUND)
            }
            queryBuilder.andWhere('projects.authorOfProject.id = :id', {
                id: author.id
            })
        }
        if (query.limit) {
            queryBuilder.limit(query.limit);
        }
        if (query.offset) {
            queryBuilder.offset(query.offset);
        }
        const projects = await queryBuilder.getMany();
        return { projects, projectsCount}
    }


    async addMember(email: string, slugProject: string): Promise<any> {
        
        const project = await this.findBySlug(slugProject);
        const member = await this.userRepository.findOneBy({email});

        if (!member) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        project.membersOfProject = [member];
        member.projectsMember = [project];
        await this.userRepository.save(member);

        return 'ok';
    }

 
    async allMembers(slugProject: string): Promise<any> {
        const queryBuilder = AppDataSource
            .getRepository(ProjectEntity)
            .createQueryBuilder('projects')
            .leftJoinAndSelect('projects.membersOfProject', 'members')
            .where('projects.slug = :slug', { slug: slugProject });
        
            //const membersCount = await queryBuilder.getCount();
            const members = await queryBuilder.getOne();
            
            return members.membersOfProject;
    }


    async memeberProject(slug: string): Promise<any> {

    }

    /* -------------- AUXILARY -------------- */

    buildProjectResponse(project: ProjectEntity) {
        return { project }
    }


    private getSlug(title: string) {
        return slugify(title, {
            lower: true
        }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    }
}