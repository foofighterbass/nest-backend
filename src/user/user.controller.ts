import { Body, Controller, Get, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from './decorators/users.decorator';
import { CreateUsersDto } from './dto/createUsers.dto';
import { LoginUsersDto } from './dto/loginUsers.dto';
import { UpdateUsersDto } from './dto/updateUsers.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserEntity } from './user.entity';
import { UsersService } from './user.service';

@Controller('user')
export class UsersController {
 
    constructor(private readonly usersService: UsersService) {}


    @Post('create')//create user
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') createUsersDto: CreateUsersDto): Promise<any> {
        const user = await this.usersService.createUser(createUsersDto);
        return this.usersService.buildUserResponse(user);
    }


    @Post('login')//login user
    @UsePipes(new ValidationPipe())
    async loginUser(@Body('user') loginUsersDto: LoginUsersDto): Promise<any> {
        const user = await this.usersService.loginUser(loginUsersDto);
        return this.usersService.buildUserResponse(user);
    }


    @Get()//get current user
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UserEntity): Promise<any> {
        return this.usersService.buildUserResponse(user);
    }

    
    @Put()//update user fields
    @UseGuards(AuthGuard)
    async updateUser(
        @User('id') currentUserId: number,
        @Body('user') updateUsersDto: UpdateUsersDto): 
    Promise<any> {
        const user = await this.usersService.updateUser(currentUserId, updateUsersDto);
        return this.usersService.buildUserResponse(user);
    }
}