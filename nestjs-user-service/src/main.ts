// Nest
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

// Vendor
import * as csurf from 'csurf';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// Src
import { AppModule } from './app.module';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(csurf());

  const options = new DocumentBuilder()
    .setTitle('User APIs docs')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'authorization',
    )
    .addTag('users')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  // TCP microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 8000,
    },
  });

  // Kafka microservice
  // const microserviceKafka = app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {4
  //     client: {
  //       brokers: ['localhost:9092'],
  //     },
  //   },
  // });

  await app.startAllMicroservices();
  await app.listen(8001, () => logger.log('Microservice User is listening'));
}
bootstrap();
