import { CacheService } from "./cache.service";
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('CacheService', () => {
  
    let http, cacheService;

    beforeEach(() => {
        http = instance(mock(HttpClient)), instance(mock(Meta));
        cacheService = new CacheService();
      });

  it('notify all observers', done => {  
    let calledWithParam;
    spyOn(http, 'get').and.callFake(param => {
      calledWithParam = param;
      return of({ data: [], success: true });
    });

    cacheService.set('foo', 'bar', 10000);
    cacheService.get('features', http.get(`/api/features`))
    .subscribe(res => {
        expect(cacheService.has('foo').toBeTruthy);
        done();
      });
  });


});
