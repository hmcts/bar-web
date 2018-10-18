import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import { UserService } from '../../services/user/user.service';


@Injectable()
export class AuthDevInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let dupReq = null;
    if (this.userService.getUser()) {
      dupReq = req.clone({ headers: req.headers.set('Auth-Dev', this.userService.getUser().email) });
    } else {
      dupReq = req;
    }
    return next.handle(dupReq);
  }

}
