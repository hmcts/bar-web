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

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CurrencyConverterInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.body) {
      request = request.clone({
          body: convertPoundToPence(request.body)
      });
    }
    return next.handle(request).map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          event = event.clone({
            body: convertPenceToPound(event.body)
          });
        }
        return event;
      });
  }
}
