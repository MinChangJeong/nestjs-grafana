import { Injectable } from '@nestjs/common';
import { Counter, Histogram, register, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly queryDuration: Histogram<string>;
  private readonly queryErrorCount: Counter<string>;
  
  constructor() {
    this.queryDuration = new Histogram({
      name: 'typeorm_query_duration_seconds',
      help: 'Histogram of TypeORM query execution times',
      labelNames: ['query'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    });

    this.queryErrorCount = new Counter({
      name: 'typeorm_query_errors_total',
      help: 'Total number of TypeORM query errors',
      labelNames: ['query'],
    });
  }

  async recordQueryDuration(query: string, duration: number): Promise<void> {
    // 비동기적으로 메트릭 기록
    await new Promise(resolve => setTimeout(() => resolve(this.queryDuration.labels(query).observe(duration)), 0));
  }

  incrementQueryError(query: string): void {
    this.queryErrorCount.labels(query).inc();
  }

  getMetricsRegistry(): Promise<string> {
    return register.metrics();
  }
}
