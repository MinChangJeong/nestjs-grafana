// data-source.initializer.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Injectable()
export class DataSourceInitializer implements OnApplicationBootstrap {
  constructor(private readonly dataSource: DataSource) {}

  onApplicationBootstrap() {
    // 이제 NestJS의 DataSource가 초기화된 상태이므로, 등록 가능
    addTransactionalDataSource(this.dataSource);
  }
}
