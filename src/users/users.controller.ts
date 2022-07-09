import { Body, Controller, Get, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from './decorators/users.decorator';
import { CreateUsersDto } from './dto/createUsers.dto';
import { LoginUsersDto } from './dto/loginUsers.dto';
import { UpdateUsersDto } from './dto/updateUsers.dto';
import { AuthGuard } from './guards/auth.guard';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('user/create')
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') createUsersDto: CreateUsersDto): Promise<any> {
        const user = await this.usersService.createUser(createUsersDto);
        return this.usersService.buildUserResponse(user);
    }

    @Post('user/login')
    @UsePipes(new ValidationPipe())
    async loginUser(@Body('user') loginUsersDto: LoginUsersDto): Promise<any> {
        const user = await this.usersService.loginUser(loginUsersDto);
        return this.usersService.buildUserResponse(user);
    }

    @Get('user')
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UsersEntity): Promise<any> {
        return this.usersService.buildUserResponse(user);
    }

    @Put('user')
    @UseGuards(AuthGuard)
    async updateUser(
        @User('id') currentUserId: number,
        @Body('user') updateUsersDto: UpdateUsersDto
    ): Promise<any> {
        const user = await this.usersService.updateUser(currentUserId, updateUsersDto);
        return this.usersService.buildUserResponse(user);
    }
}