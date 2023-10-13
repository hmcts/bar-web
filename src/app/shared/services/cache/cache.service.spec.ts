import { CacheService } from "./cache.service";
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';
import { of } from 'rxjs';
import {async, TestBed} from "@angular/core/testing";


describe('CacheService', () => {
  
    let http, cacheServiceToBeTested;

    beforeEach(() => {
        http = instance(mock(HttpClient)), instance(mock(Meta));
        cacheServiceToBeTested = new CacheService();
      });

  fit('Test set', async(() => {
    cacheServiceToBeTested = new CacheService();
    cacheServiceToBeTested.set('foo', 'bar', 10000);
    let result = cacheServiceToBeTested.get('foo');
    result.subscribe((data) => {
        expect(data).toEqual('bar');
        console.info('Happy days');
      },
      (error) => {
        console.error('ERROR'+ error.toString());
      },
      () => {
        console.info('happy days');
      });
  }));

  fit('Test set with no age', async(() => {
    cacheServiceToBeTested = new CacheService();
    cacheServiceToBeTested.set('foo', 'bar');
    let result = cacheServiceToBeTested.get('foo');
    result.subscribe((data) => {
        expect(data).toEqual('bar');
        console.info('Happy days');
      },
      (error) => {
        console.error('ERROR'+ error.toString());
      },
      () => {
        console.info('happy days');
      });
  }));


  fit('Test has', () => {

    cacheServiceToBeTested = new CacheService();
    cacheServiceToBeTested.set('foo', 'bar', 10000);
    let result = cacheServiceToBeTested.has('foo');
    expect(result).toEqual(true);
  });

});
