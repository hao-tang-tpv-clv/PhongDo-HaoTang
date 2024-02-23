// Nest
import { ClientsModule, Transport } from '@nestjs/microservices';
// Src
import { modulesConst } from '@common/constants/modulesConst';

export const UserModules = ClientsModule.register([
  {
    name: modulesConst.USER_SERVICE,
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 8000,
    },
  },
]);
