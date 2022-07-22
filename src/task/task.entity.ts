import { GroupEntity } from "src/group/group.entity";
import { ProjectEntity } from "src/project/project.entity";
import { SubtaskEntity } from "src/subtask/subtask.entity";
import { UserEntity } from "src/user/user.entity";
import { BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks'})
export class TaskEntity {
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

    @ManyToOne(() => UserEntity, (author) => author.tasksAuthor, {eager: true})
    authorOfTask: UserEntity;

    @ManyToOne(() => GroupEntity, (group) => group.tasksOfGroup)
    groupOfTasks: GroupEntity;

    @ManyToOne(() => ProjectEntity, (projects) => projects.tasksOfProject, {eager: true})
    projectOfTask: ProjectEntity;

    @ManyToMany(() => UserEntity, (members) => members.tasksMember)
    @JoinTable()
    membersOfTask: UserEntity[];
 
    @OneToMany(() => SubtaskEntity, (subtasks) => subtasks.taskOfSubtasks)
    subtasksOfTask: SubtaskEntity[];
}