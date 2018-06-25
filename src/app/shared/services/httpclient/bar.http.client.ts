import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BarHttpClient {

  constructor(private http: HttpClient, private meta: Meta) { }

  addHeaders(options: any): any {
    const csrfToken = this.meta.getTag('name=csrf-token');
    const headers = {};
    if (options.headers) {
      options.headers.forEach(element => {
        headers[element] = options.headers.get(element);
      });
    }
    headers['X-Requested-With'] = 'XMLHttpRequest';
    headers['CSRF-Token'] = csrfToken.content;
    options.headers = new HttpHeaders(headers);
    return options;
  }

  get(url: string, options?: any): Observable<any> {
    const opts = this.addHeaders(options || {});
    return this.http.get(url, opts);
  }

  post(url: string, body: any | null, options?: any): Observable<any> {
    const opts = this.addHeaders(options || {});
    return this.http.post(url, body, opts);
  }

  put(url: string, body: any | null, options?: any): Observable<any> {
    const opts = this.addHeaders(options || {});
    return this.http.put(url, body, opts);
  }

  delete(url: string, options?: any): Observable<any> {
    this.addHeaders(options || {});
    return this.http.delete(url, options);
  }
}
