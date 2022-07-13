import { UserEntity } from "src/user/user.entity";
import { BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'projects'})
export class ProjectEntity {
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

    @ManyToOne(() => UserEntity, user => user.projects, {eager: true})
    author: UserEntity;

    @ManyToMany(() => UserEntity, (users) => users.usersProjects)
    @JoinTable()
    users: UserEntity[];
}