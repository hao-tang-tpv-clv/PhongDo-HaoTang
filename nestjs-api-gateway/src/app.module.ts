// Nest
import { Module } from '@nestjs/common';

// Vendor

// Src
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';

@Module({
  imports: [AuthModule, UserModule, RoleModule, PermissionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
