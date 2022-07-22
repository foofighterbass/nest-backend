import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { AppDataSource } from 'src/AppDataSource';
import { GroupEntity } from 'src/group/group.entity';
import { ProjectEntity } from 'src/project/project.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { StatusTaskDto } from './dto/statusTask.dto';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(TaskEntity) 
            private readonly taskRepository: Repository<TaskEntity>,
        @InjectRepository(GroupEntity) 
            private readonly groupRepository: Repository<GroupEntity>,
        @InjectRepository(ProjectEntity) 
            private readonly projectRepository: Repository<ProjectEntity>,
        @InjectRepository(UserEntity) 
            private readonly userRepository: Repository<UserEntity>
    ) {}


    async createTask(currentUser: UserEntity, query, createTaskDto): Promise<any> {
        if (query.group && query.project) {
            const group = await this.groupRepository.findOneBy({
                id: query.group
            });
            if (!group) {
                throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
            }
            const project = await this.findBySlug(query.project);
            const newTask = new TaskEntity;

            Object.assign(newTask, createTaskDto);
            newTask.authorOfTask = currentUser;
            //project.groupsOfProject = [newGroup];
            newTask.projectOfTask = project;
            newTask.groupOfTasks = group;

            await this.taskRepository.save(newTask);

            return newTask;
        } 
    }


    async findTask(query): Promise<any> {
        //console.log(query.id)
        if (query.id) {
            const task = await this.taskRepository.findOneBy({
                id: query.id
            });
            if (!task) {
                throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
            }
            return task;
        }
    }


    async allTasks(query): Promise<any> {
        const project = await this.findBySlug(query.project);
        const group = await this.groupRepository.findOneBy({
            id: query.group
        });
        //console.log(group.id)
        const queryBuilder = AppDataSource
            .getRepository(TaskEntity)
            .createQueryBuilder('tasks')
            .leftJoinAndSelect('tasks.authorOfTask', 'author')
            .where('tasks.groupOfTasks.id = :group', { group: group.id })
            .andWhere('tasks.projectOfTask.id = :project', { project: project.id });

            const tasks = await queryBuilder.getMany();

            return {tasks}
    }


    async addMember(email: string, query: any): Promise<any> {
        const task = await this.taskRepository.findOneBy({
            id: query.task
        });
        const member = await this.userRepository.findOneBy({email});

        if (!member) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        task.membersOfTask = [member];
        member.tasksMember = [task];
        await this.userRepository.save(member);
        return 'ok';
    }


    async allMembers(query: any): Promise<any> {
        const queryBuilder = AppDataSource
            .getRepository(TaskEntity)
            .createQueryBuilder('tasks')
            .leftJoinAndSelect('tasks.membersOfTask', 'members')
            .where('tasks.id = :id', { id: query.id });
        
            //const membersCount = await queryBuilder.getCount();
            const members = await queryBuilder.getOne();
            
            return members.membersOfTask;
    }


    async taskStatus(query, statusTaskDto: StatusTaskDto): Promise<any> {
        const task = await this.taskRepository.findOneBy({
            id: query.task
        });

        console.log(task)

        Object.assign(task, statusTaskDto);

        console.log(task.status)
        await this.taskRepository.save(task);
        return task
    }

    /* -------------- AUXILARY -------------- */

    async findBySlug(slug: string) {
        return this.projectRepository.findOneBy({slug});
    }


    buildTaskResponse(task: TaskEntity) {
        return { task }
    }


    private getSlug(title: string) {
        return slugify(title, {
            lower: true
        }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    }
}