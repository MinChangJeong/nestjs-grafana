import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardModule } from './board/board.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Board } from './board/board.entity';
import { DataSourceInitializer } from './datasource.initializer';

import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { TypeOrmLogger } from './common/logger/typeorm-logger.service';
import { MetricsService } from './common/metrics/metrics.service';

@Module({
  imports: [ 
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || 'nestuser',
        password: process.env.DB_PASSWORD || 'rootpw',
        database: process.env.DB_DATABASE || 'nestjs_test',
        entities: [Board],
        synchronize: true,
        logging: true,
        logger: new TypeOrmLogger(new MetricsService()),
      }),
    }),

    WinstonModule.forRoot({
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

    PrometheusModule.register({
      path: '/metrics', // Endpoint for Prometheus to scrape
      defaultMetrics: {
        enabled: true,
      },
    }),

    BoardModule,
  ],

  controllers: [AppController],
  providers: [AppService, DataSourceInitializer],
})
export class AppModule {}
