// Nest
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';

// Src
import { UserService } from './user.service';
import { FindUserDto, UpdateUserDto, CreateUserDto } from '@common/dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('find_user_by_id', Transport.TCP)
  findOne(@Payload() id: number) {
    return this.userService.findUserById(id);
  }

  @MessagePattern('findAllUser', Transport.TCP)
  findAll(@Payload() findUserDto: FindUserDto) {
    return this.userService.findAllUser(findUserDto);
  }

  @MessagePattern('createUser', Transport.TCP)
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @MessagePattern('updateUser', Transport.TCP)
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @MessagePattern('removeUser', Transport.TCP)
  remove(@Payload() id: number) {
    return this.userService.removeUser(id);
  }
}
