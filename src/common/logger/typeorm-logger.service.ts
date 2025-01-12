import { Injectable } from '@nestjs/common';
import { Logger, QueryRunner } from 'typeorm';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class TypeOrmLogger implements Logger {
  constructor(private readonly metricsService: MetricsService) {}

  logQuery(query: string, parameters?: any[]) {
    if (this.isImportantQuery(query)) {
      const startTime = Date.now();
      // 쿼리 실행
      // TypeORM 실행 후
      const duration = Date.now() - startTime;
      this.metricsService.recordQueryDuration(query, duration);
    }
  }

  private isImportantQuery(query: string): boolean {
    const queryType = query.trim().toUpperCase().split(' ')[0];
    return ['SELECT', 'INSERT', 'UPDATE', 'DELETE'].includes(queryType);
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: any): void {
    this.metricsService.incrementQueryError(query);
    console.error(`[Query Error]: ${query}`, error);
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): void {
    console.warn(`Slow Query detected: ${time}ms`);
    console.warn(`Query: ${query}`);
    if (parameters && parameters.length) {
      console.warn(`Parameters: ${JSON.stringify(parameters)}`);
    }
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    console.log(`Schema Build: ${message}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner): void {
    console.log(`Migration: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): void {
    switch (level) {
      case 'log':
        console.log(message);
        break;
      case 'info':
        console.info(message);
        break;
      case 'warn':
        console.warn(message);
        break;
    }
  }
}
