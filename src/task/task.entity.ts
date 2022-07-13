import { GroupEntity } from "src/group/group.entity";
import { SubtaskEntity } from "src/subtask/subtask.entity";
import { UserEntity } from "src/user/user.entity";
import { BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'tasks'})
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    slug: string;

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

    @ManyToOne(() => GroupEntity, (group) => group.tasksOfGroup)
    groupOfTasks: GroupEntity;

    @ManyToMany(() => UserEntity, (members) => members.tasksMember)
    @JoinTable()
    membersOfTask: UserEntity[];

    @OneToMany(() => SubtaskEntity, (subtasks) => subtasks.taskOfSubtasks)
    subtasksOfTask: SubtaskEntity[];
}