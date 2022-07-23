import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
        await this.addMember(newGroup.authorOfGroup.email, newGroup.id);

        return newGroup
    }


    async findGroup(query: any): Promise<any> {
        if (query.id) {
            const group = await this.groupRepository.findOneBy({
                id: query.id
            });
            if (!group) {
                throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
            }
            return group;
        }
        throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }


    async allGroups(slug): Promise<any> {
        const project = await this.findBySlug(slug);
        //console.log(project.id)
        const queryBuilder = AppDataSource
            .getRepository(GroupEntity)
            .createQueryBuilder('groups')
            .leftJoinAndSelect('groups.authorOfGroup', 'author')
            .where('groups.projectOfGroup.id = :project', { project: project.id });

        const groups = await queryBuilder.getMany();

        return {groups}
    }


    async addMember(email: string, groupId: any): Promise<any> {
        const group = await this.groupRepository.findOneBy({
            id: groupId
        });
        const member = await this.userRepository.findOneBy({email});

        if (!member) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        group.membersOfGroup = [member];
        member.groupsMember = [group];
        await this.userRepository.save(member);
        return 'ok';
    }


    async allMembers(groupId): Promise<any> {
        const queryBuilder = AppDataSource
            .getRepository(GroupEntity)
            .createQueryBuilder('groups')
            .leftJoinAndSelect('groups.membersOfGroup', 'members')
            .where('groups.id = :id', { id: groupId });
        
        //const membersCount = await queryBuilder.getCount();
        const members = await queryBuilder.getOne();
            
        return members.membersOfGroup;
    }

    /* -------------- AUXILARY -------------- */

    async findBySlug(slug) {
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