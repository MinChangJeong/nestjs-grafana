import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule); // AppModule에서 설정한 로거가 자동으로 사용됨
  
  // app.useGlobalInterceptors(new LoggingInterceptor()); // 전역 로깅 인터셉터 설정

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
