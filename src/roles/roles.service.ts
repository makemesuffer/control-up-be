import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto, PaginatedRolesDto } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(
    limit: number = 10,
    offset: number = 0,
  ): Promise<PaginatedRolesDto> {
    const [roles, count] = await this.roleRepository.findAndCount({
      take: limit,
      skip: offset,
    });

    return { roles, count };
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = new Role();
    role.name = createRoleDto.name;
    return this.roleRepository.save(role);
  }

  async initializeDefaultRoles(): Promise<void> {
    const count = await this.roleRepository.count();
    if (count === 0) {
      await this.create({ name: 'viewer' });
      await this.create({ name: 'editor' });
      await this.create({ name: 'admin' });
    }
  }
}
