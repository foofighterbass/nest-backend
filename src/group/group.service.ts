import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { AppDataSource } from 'src/AppDataSource';
import { ProjectEntity } from 'src/project/project.entity';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/createGroup.dto';
import { GroupEntity } from './group.entity';

@Injectable()
export class GroupService {

    constructor(
        @InjectRepository(GroupEntity) 
            private readonly groupRepository: Repository<GroupEntity>,
        @InjectRepository(ProjectEntity) 
            private readonly projectRepository: Repository<ProjectEntity>,
        @InjectRepository(UserEntity) 
            private readonly userRepository: Repository<UserEntity>
    ) {}

    async createGroup(currentUser: UserEntity, createGroupDto: CreateGroupDto, slug: string): Promise<any> {
        const project = await this.findBySlug(slug);
        const newGroup = new GroupEntity;
        
        Object.assign(newGroup, createGroupDto);
        newGroup.authorOfGroup = currentUser;
        //project.groupsOfProject = [newGroup];
        newGroup.projectOfGroup = project;

        await this.groupRepository.save(newGroup);

        return newGroup
    }

    async allProjects(slug: string): Promise<any> {
        const project = await this.findBySlug(slug);
        const queryBuilder = AppDataSource
            .getRepository(GroupEntity)
            .createQueryBuilder('groups')
            .leftJoinAndSelect('groups.authorOfGroup', 'author')
            //.where('groups.projectOfGroup = :project', { project: project });

            const groups = await queryBuilder.getMany();

            return {groups}
    }

    /* -------------- AUXILARY -------------- */

    async findBySlug(slug: string) {
        return this.projectRepository.findOneBy({slug});
    }

    buildGroupResponse(group: GroupEntity) {
        return { group }
    }


    private getSlug(title: string) {
        return slugify(title, {
            lower: true
        }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
    }
}