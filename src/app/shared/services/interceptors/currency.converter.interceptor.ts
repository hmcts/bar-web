import { Injectable } from '@angular/core';
import { convertPenceToPound, convertPoundToPence } from '../../models/util/model.utils';
import {
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CurrencyConverterInterceptor implements HttpInterceptor {

  static EXCLUDES: Array<string> = ['/fees/search', '/payment-instructions?format=csv'];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.body) {
      request = request.clone({
          body: convertPoundToPence(request.body)
      });
    }
    return next
      .handle(request)
      .pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse && !this.checkUrl((<HttpResponse<any>> event).url) ) {
            event = event.clone({
              body: convertPenceToPound(event.body)
            });
          }
          return event;
        })
      );
  }

  checkUrl(url: String): boolean {
    return CurrencyConverterInterceptor.EXCLUDES.some(pattern => url.includes(pattern));
  }
}
