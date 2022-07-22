import { GroupEntity } from "src/group/group.entity";
import { ProjectEntity } from "src/project/project.entity";
import { TaskEntity } from "src/task/task.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class UserEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column({select: false})
    password: string;

    @OneToMany(() => ProjectEntity, (projects) => projects.authorOfProject)
    projectsAuthor: ProjectEntity[];

    @OneToMany(() => GroupEntity, (groups) => groups.authorOfGroup)
    groupsAuthor: ProjectEntity[];

    @OneToMany(() => TaskEntity, (tasks) => tasks.authorOfTask)
    tasksAuthor: ProjectEntity[];

    @ManyToMany(() => ProjectEntity, (projects) => projects.membersOfProject)
    projectsMember: ProjectEntity[];

    @ManyToMany(() => GroupEntity, (groups) => groups.membersOfGroup)
    groupsMember: GroupEntity[];
 
    @ManyToMany(() => TaskEntity, (tasks) => tasks.membersOfTask)
    tasksMember: TaskEntity[];
}