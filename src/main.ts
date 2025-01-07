// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

import { initializeTransactionalContext } from 'typeorm-transactional';

import { LoggingInterceptor } from './common/interceptors/logger.interceptor';

async function bootstrap() {
  initializeTransactionalContext();
  
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new LokiTransport({
          host: 'http://localhost:3100', // Loki 서버의 URL
          labels: { app: 'nestjs-app' }, // 로그 라벨 설정
        }),
      ],
    }),
  });

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(3000);
}
bootstrap();
