import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  PaginatedUsersDto,
} from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(
    limit: number = 10,
    offset: number = 0,
    roleId?: number,
  ): Promise<PaginatedUsersDto> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role');

    if (roleId) {
      queryBuilder
        .innerJoin('user.roles', 'filterRole')
        .where('filterRole.id = :roleId', { roleId });
    }

    queryBuilder.take(limit).skip(offset);

    const [users, count] = await queryBuilder.getManyAndCount();

    return { users, count };
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;

    if (createUserDto.roleIds && createUserDto.roleIds.length > 0) {
      const roles = await this.roleRepository.findBy({
        id: In(createUserDto.roleIds),
      });

      if (roles.length !== createUserDto.roleIds.length) {
        throw new BadRequestException('Some roles not found');
      }

      user.roles = roles;
    }

    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.name !== undefined) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.email !== undefined) {
      user.email = updateUserDto.email;
    }

    return this.userRepository.save(user);
  }

  async updateRoles(
    id: number,
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = await this.roleRepository.findBy({
      id: In(updateUserRoleDto.roleIds),
    });

    if (roles.length !== updateUserRoleDto.roleIds.length) {
      throw new BadRequestException('Some roles not found');
    }

    user.roles = roles;
    return this.userRepository.save(user);
  }
}
