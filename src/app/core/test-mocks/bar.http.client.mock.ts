import { Observable } from 'rxjs';


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
