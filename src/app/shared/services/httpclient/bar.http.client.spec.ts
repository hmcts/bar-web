import { BarHttpClient } from './bar.http.client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

describe('BarHttpClient', () => {
  let httpClient: BarHttpClient;
  let meta: Meta;
  let http: HttpClient;
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
  beforeEach(() => {
    meta = instance(mock(Meta));
    http = instance(mock(HttpClient));
    httpClient = new BarHttpClient(http, meta);
    spyOn(meta, 'getTag').and.returnValue({ content: 'this-is-a-token' });
    spyOn(http, 'get').and.callFake(httpCallFakeWoBody);
    spyOn(http, 'delete').and.callFake(httpCallFakeWoBody);
    spyOn(http, 'post').and.callFake(httpCallFakeWBody);
    spyOn(http, 'put').and.callFake(httpCallFakeWBody);
  });

  function testBodyWithOtherOptions(requestType, done, body) {
    let response: Observable<any>;
    if (body) {
      response = httpClient[requestType]('whatever/url', body, {headers: new HttpHeaders({ 'X-My-Header': 'mine' })});
    }else {
      response = httpClient[requestType]('whatever/url', {headers: new HttpHeaders({ 'X-My-Header': 'mine' })});
    }
    response.subscribe(val => {
      expect(val.headers.get('X-My-Header')).toBe('mine');
      expect(val.headers.get('CSRF-Token')).toBe('this-is-a-token');
      done();
    });
  }

  function testBodyWithoutOptions(requestType, done, body) {
    let response: Observable<any>;
    if (body) {
      response = httpClient[requestType]('whatever/url', body);
    }else {
      response = httpClient[requestType]('whatever/url');
    }
    response.subscribe(val => {
      expect(val.headers.get('CSRF-Token')).toBe('this-is-a-token');
      done();
    });
  }

  it('adding headers to get request while the originals remain there', done => {
    testBodyWithOtherOptions('get', done, null);
  });
  it('adding headers to delete request while the originals remain there', done => {
    testBodyWithOtherOptions('delete', done, null);
  });
  it('adding headers to post request while the originals remain there', done => {
    testBodyWithOtherOptions('post', done, {});
  });
  it('adding headers to put request while the originals remain there', done => {
    testBodyWithOtherOptions('put', done, {});
  });

  it('testing get when no options', done => {
    testBodyWithoutOptions('get', done, null);
  });
  it('testing delete when no options', done => {
    testBodyWithoutOptions('delete', done, null);
  });
  it('testing post when no options', done => {
    testBodyWithoutOptions('post', done, null);
  });
  it('testing put when no options', done => {
    testBodyWithoutOptions('put', done, null);
  });
});
