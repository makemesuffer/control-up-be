import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  GetUsersQueryDto,
  PaginatedUsersDto,
} from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() query: GetUsersQueryDto): Promise<PaginatedUsersDto> {
    return this.usersService.findAll(query.limit, query.offset, query.roleId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.usersService.update(userId, updateUserDto);
  }

  @Patch(':id/roles')
  async updateRoles(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.usersService.updateRoles(userId, updateUserRoleDto);
  }
}
