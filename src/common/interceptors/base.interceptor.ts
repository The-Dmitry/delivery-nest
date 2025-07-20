// import {
//   type CallHandler,
//   type ExecutionContext,
//   Injectable,
//   type NestInterceptor,
// } from '@nestjs/common';
// import { Observable, tap, catchError, map } from 'rxjs';

// @Injectable()
// export class BaseInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const result = next.handle(
//       map((data) => {
//         console.log('Response data:', data);
//         return data;
//       }),
//     );
//     return next.handle().pipe(
//       tap(() => console.log('Response is sent')),
//       catchError((err) => {
//         console.log('Error caught in interceptor:', err.message);
//         throw err; // обязательно пробросить дальше, иначе фильтр не сработает
//       }),
//     );
//   }
// }
