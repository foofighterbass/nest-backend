import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/createUsers.dto';
import { UsersEntity } from './users.entity';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { LoginUsersDto } from './dto/loginUsers.dto';
import { UpdateUsersDto } from './dto/updateUsers.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UsersEntity) 
        private readonly usersRepository: Repository<UsersEntity>
    ) {}

    async createUser(createUsersDto: CreateUsersDto): Promise<any> {
        const userByEmail = await this.usersRepository.findOneBy({
            email: createUsersDto.email
        });
        const userByPhone = await this.usersRepository.findOneBy({
            phone: createUsersDto.phone
        });
        if (userByEmail || userByPhone) {
            throw new HttpException('Email or phone are taken', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const newUser = new UsersEntity;
        Object.assign(newUser, createUsersDto);
        return await this.usersRepository.save(newUser);
    }

    async loginUser(loginUsersDto: LoginUsersDto): Promise<any> {
        const user = await this.usersRepository.findOneBy({
            email: loginUsersDto.email,
            password: loginUsersDto.password
        });
        if (user) {
            return user;
        }else{
            throw new HttpException('Email or password are not correct ', HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    async updateUser(currentUserId: number, updateUsersDto: UpdateUsersDto): Promise<any> {
        const user = await this.findById(currentUserId);
        Object.assign(user, updateUsersDto);
        return await this.usersRepository.save(user);
    }

    findById(id: number): any {
        return this.usersRepository.findOneBy({id});
    }

    buildUserResponse(user: UsersEntity): any {
        return {
            user: {
                ...user,
                token: this.generateJwt(user)
            }
        };
    }

    generateJwt(user: UsersEntity): any {
        return sign(
            {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email
            }, 
            JWT_SECRET
        );
    }
}