import { SetMetadata } from "@nestjs/common";
import { Aspect, LazyDecorator, WrapParams, createDecorator } from "@toss/nestjs-aop";

export const LOGABLE = Symbol('LOG');
export const Logable = () => createDecorator(LOGABLE)


@Aspect(LOGABLE)
export class LogLazyDecorator implements LazyDecorator {
    wrap(params: WrapParams<Function, unknown>): Function {
        const { instance, methodName, method, metadata } = params;
        
        // 메서드를 래핑하는 로직을 추가
        return function (...args: any[]) {
          console.log(`Before method: ${methodName}`);
          console.log('Metadata:', metadata);
          
          // 원본 메서드 호출
          const result = method.apply(instance, args);
          
          console.log(`After method: ${methodName}`);
          return result;
        };
    }
}