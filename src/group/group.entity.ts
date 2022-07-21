import { ProjectEntity } from "src/project/project.entity";
import { TaskEntity } from "src/task/task.entity";
import { UserEntity } from "src/user/user.entity";
import { BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'groups'})
export class GroupEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
 
    @Column()
    description: string;

    @Column()
    due: Date;

    @Column({default: 0})
    status: number;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date;
    }

    @ManyToOne(() => UserEntity, (author) => author.groupsAuthor, {eager: true})
    authorOfGroup: UserEntity;

    @ManyToOne(() => ProjectEntity, (projects) => projects.groupsOfProject, {eager: true})
    projectOfGroup: ProjectEntity;

    @ManyToMany(() => UserEntity, (members) => members.groupsMember)
    @JoinTable()
    membersOfGroup: UserEntity[];

    @OneToMany(() => TaskEntity, (tasks) => tasks.groupOfTasks)
    tasksOfGroup: TaskEntity[]
}