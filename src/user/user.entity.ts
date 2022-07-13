import { ProjectEntity } from "src/project/project.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => ProjectEntity, project => project.author)
    projects: ProjectEntity[];

    @ManyToMany(() => ProjectEntity, (usersProjects) => usersProjects.users)
    usersProjects: ProjectEntity[]
}