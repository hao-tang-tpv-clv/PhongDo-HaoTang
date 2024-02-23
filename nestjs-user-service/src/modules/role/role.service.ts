// Nest
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Vendor
import { Repository } from 'typeorm';

// Src
import { CreateRoleDto } from '../../common/dto/role/create-role.dto';
import { UpdateRoleDto } from '../../common/dto/role/update-role.dto';
import { Role } from '@src/entities';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  createRole(createRoleDto: CreateRoleDto) {
    console.log(
      '🚀 ~ RoleService ~ createRole ~ createRoleDto:',
      createRoleDto,
    );
    return 'This action adds a new role';
  }

  findAllRole() {
    return `This action returns all role`;
  }

  findRoleById = async (id: number) => {
    const role = await this.roleRepository.findOneBy({ id });
    return role;
  };

  findRoleByCode = async (code: string) => {
    const role = await this.roleRepository.findOneBy({ code });
    return role;
  };

  findRoleByName = async (name: string) => {
    const role = await this.roleRepository.findOneBy({ name });
    return role;
  };

  updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    console.log(
      '🚀 ~ RoleService ~ updateRole ~ updateRoleDto:',
      updateRoleDto,
    );
    return `This action updates a #${id} role`;
  }

  removeRole(id: number) {
    return `This action removes a #${id} role`;
  }
}
