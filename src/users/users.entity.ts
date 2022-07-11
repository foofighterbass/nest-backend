import { ProjectEntity } from "src/project/project.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class UsersEntity {
    
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
}