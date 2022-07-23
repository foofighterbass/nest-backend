import { Body, Controller, Get, Param, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from 'src/user/decorators/users.decorator';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { CreateGroupDto } from './dto/createGroup.dto';
import { GroupService } from './group.service';

@Controller(':slug')
export class GroupController {

    constructor(private readonly groupService: GroupService) {}
 
  
    @Post('group/create')//create new group
    @UsePipes(new ValidationPipe)
    @UseGuards(AuthGuard)
    async createGroup(
        @User() currentUser: UserEntity,
        @Param('slug') slug: string,
        @Body('group') createGroupDto: CreateGroupDto): 
    Promise<any> {
        const group = await this.groupService.createGroup(currentUser, createGroupDto, slug);
        return this.groupService.buildGroupResponse(group);
    }


    @Get('group')
    async findGroup(@Query() query: any): Promise<any> {
        const group = await this.groupService.findGroup(query)
        return await this.groupService.buildGroupResponse(group);
    }


    @Get('group/all')
    async allGroups(
        @Param('slug') slug: string,
        @Query() query: any): 
    Promise<any> {
        return await this.groupService.allGroups(slug);
    }


    @Post(':groupid/addmember')
    @UseGuards(AuthGuard)
    async addMember(
        @Body('email') email: string,
        @Param('groupid') groupId: string): 
    Promise<any> {
        return await this.groupService.addMember(email, groupId)
    }


    @Get(':groupid/members')
    @UseGuards(AuthGuard)
    async allMembers(
        @Param('groupid') groupId: string):
    Promise<any> {
        return await this.groupService.allMembers(groupId);
    }
}