// Nest
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

// Src
import { ConfigType } from '@src/typings';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<ConfigType>) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      host: this.configService.get('postgres.host', { infer: true }),
      port: this.configService.get('postgres.port', { infer: true }),
      username: this.configService.get('postgres.username', { infer: true }),
      password: this.configService.get('postgres.password', { infer: true }),
      database: this.configService.get('postgres.database', { infer: true }),
      type: this.configService.get('postgres.type', { infer: true }),
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
      // migrations: [
      //   path.resolve(`${__dirname}/../../../database/migrations/*{.ts,.js}`)
      // ],
      // migrationsTableName: 'migrations',
    } as TypeOrmModuleOptions;
  }
}
