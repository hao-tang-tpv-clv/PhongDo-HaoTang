import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RoleService } from './role.service';
import { CreateRoleDto } from '../../common/dto/role/create-role.dto';
// import { UpdateRoleDto } from '../../common/dto/role/update-role.dto';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern('createRole')
  create(@Payload() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @MessagePattern('findAllRole')
  findAll() {
    return this.roleService.findAllRole();
  }

  // @MessagePattern('findOneRole')
  // findOne(@Payload() id: number) {
  //   return this.roleService.findOne(id);
  // }

  // @MessagePattern('updateRole')
  // update(@Payload() updateRoleDto: UpdateRoleDto) {
  //   return this.roleService.update(updateRoleDto.id, updateRoleDto);
  // }

  // @MessagePattern('removeRole')
  // remove(@Payload() id: number) {
  //   return this.roleService.remove(id);
  // }
}
