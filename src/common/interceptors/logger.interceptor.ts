// logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { logger } from '../logger/winston.logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const now = Date.now();

    // 특정 경로를 로깅에서 제외
    if (request.url === '/metrics') {
      return next.handle();
    }

    // 요청 로깅: 메서드, URL, 헤더, 파라미터, 본문
    logger.info(`Incoming request: ${request.method} ${request.url}`);
    logger.info(`Headers: ${JSON.stringify(request.headers)}`);
    logger.info(`Params: ${JSON.stringify(request.params)}`);
    logger.info(`Query: ${JSON.stringify(request.query)}`);
    logger.info(`Body: ${JSON.stringify(request.body)}`);

    return next
      .handle()
      .pipe(
        tap((response) => {
          // 응답 로깅: 상태 코드, 응답 본문, 처리 시간
          const responseTime = Date.now() - now;
          logger.info(`Outgoing response: ${request.method} ${request.url} ${response.statusCode} ${responseTime}ms`);
          logger.info(`Response body: ${JSON.stringify(response)}`);
        }),
        catchError((err) => {
          // 오류 로깅: 상태 코드, 오류 메시지, 처리 시간
          const responseTime = Date.now() - now;
          logger.error(`Error response: ${request.method} ${request.url} ${err.status} ${responseTime}ms`);
          logger.error(`Error details: ${JSON.stringify(err.response)}`);
          throw err;
        }),
      );
  }
}
