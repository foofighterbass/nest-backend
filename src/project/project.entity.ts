import { GroupEntity } from "src/group/group.entity";
import { UserEntity } from "src/user/user.entity";
import { BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => UserEntity, (author) => author.projectsAuthor, {eager: true})
    authorOfProject: UserEntity;

    @ManyToMany(() => UserEntity, (members) => members.projectsMember, {
        cascade: true
    })
    @JoinTable()
    membersOfProject: UserEntity[];

    @OneToMany(() => GroupEntity, (groups) => groups.projectOfGroup)
    groupsOfProject: GroupEntity[];
}