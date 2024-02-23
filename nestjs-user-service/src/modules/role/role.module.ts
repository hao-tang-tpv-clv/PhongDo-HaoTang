// Nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Src
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from '@src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
