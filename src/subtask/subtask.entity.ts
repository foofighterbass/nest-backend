import { TaskEntity } from "src/task/task.entity";
import { UserEntity } from "src/user/user.entity";
import { BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'subtasks'})
export class SubtaskEntity {
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

    @ManyToOne(() => TaskEntity, (task) => task.subtasksOfTask)
    taskOfSubtasks: TaskEntity;

    @ManyToMany(() => UserEntity, (members) => members.tasksMember)
    @JoinTable()
    membersOfTask: UserEntity[];
}