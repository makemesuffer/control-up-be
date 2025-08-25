import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import {
  CreateRoleDto,
  GetRolesQueryDto,
  PaginatedRolesDto,
} from './dto/role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(@Query() query: GetRolesQueryDto): Promise<PaginatedRolesDto> {
    return this.rolesService.findAll(query.limit, query.offset);
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }
}
