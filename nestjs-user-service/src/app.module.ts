// Nest
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Vendor
import { DataSource } from 'typeorm';

// Src
import { AuthModule } from '@auth/auth.module';
import {
  TypeOrmConfigService,
  postgresConfig,
  googleAuthConfig,
} from '@src/config';
import { UserModule } from '@src/modules';
import { RoleModule } from '@src/modules';
import { PermissionsModule } from './modules/permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [postgresConfig, googleAuthConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        return new DataSource(options).initialize();
      },
    }),
    UserModule,
    RoleModule,
    AuthModule,
    PermissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
