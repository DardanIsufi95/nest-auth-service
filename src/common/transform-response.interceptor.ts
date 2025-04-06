import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (!data) {
          return data;
        }

        // If the data is an array, transform each item
        if (Array.isArray(data)) {
          return data.map(item => this.transformItem(item));
        }

        return this.transformItem(data);
      }),
    );
  }

  private transformItem(item: any) {
    // If the item is not an object or is null, return as is
    if (typeof item !== 'object' || item === null) {
      return item;
    }

    // If the item is already a plain object, return as is
    if (item.constructor === Object) {
      return item;
    }

    // Transform the instance to a plain object
    return plainToInstance(item.constructor, item, {
      excludeExtraneousValues: false,
      enableImplicitConversion: true,
    });
  }
} 