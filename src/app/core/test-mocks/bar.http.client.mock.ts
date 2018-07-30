import { BarHttpClient } from "../../shared/services/httpclient/bar.http.client";
import { instance, mock } from "ts-mockito/lib/ts-mockito";
import { Meta } from "@angular/platform-browser";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";


const httpCallFakeWoBody = (url, opts) => {
  return new Observable(observer => {
    observer.next(opts);
    observer.complete();
  });
};
const httpCallFakeWBody = (url, body, opts) => {
  return new Observable(observer => {
    observer.next(opts);
    observer.complete();
  });
};

export class BarHttpClientMock {

  addHeaders() {
    return { content: 'this-is-a-token' };
  }

  get(url, opts) {
    return httpCallFakeWoBody(url, opts);
  }

  post(url, body, opts) {
    return httpCallFakeWBody(url, body, opts);
  }

  put(url, body, opts) {
    return httpCallFakeWBody(url, body, opts);
  }

  delete(url, opts) {
    return httpCallFakeWoBody(url, opts);
  }

  patch(url, body, opts) {
    return httpCallFakeWBody(url, body, opts);
  }
}
