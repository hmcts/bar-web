import { CacheService } from "./cache.service";
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { async, TestBed } from "@angular/core/testing";


describe('CacheService', () => {

  let http, cacheServiceToBeTested;
  let subject;

  beforeEach(() => {
    cacheServiceToBeTested = new CacheService();
    spyOn(console, 'log').and.callThrough();
  });

  it('Test set', async(() => {
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

  it('Test set with no age', async(() => {
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


  it('Test has', () => {

    cacheServiceToBeTested = new CacheService();
    cacheServiceToBeTested.set('foo', 'bar', 10000);
    let result = cacheServiceToBeTested.has('foo');
    expect(result).toEqual(true);
  });

  it('notifies in flight observers', () => {

    // simulate 2 api calls by creating a new Subject and passing it to the cache service twice.
    cacheServiceToBeTested = new CacheService();
    let subject1 = new Subject<string>();
    //@ts-ignore
    spyOn(subject1, 'observed');
    subject1.subscribe({
      next: (v) => {
        //console.log(`observer: ${v}`),
      }
    });
    cacheServiceToBeTested.get("subject1", subject1).subscribe(
      value => {
        //console.log('got a value from my subscription:', value)
      });
    cacheServiceToBeTested.get("subject1", subject1).subscribe(
      value => {
        //console.log('got a value from my subscription:', value)
      });
    // The subject needs data to send. This simulates the api coming back with data
    subject1.next('hello');
    expect(subject1.observed).toBeTrue();
    console.log('subject1.observed:', subject1.observed);
    expect(console.log).toHaveBeenCalled();
  });


  it('notifies in flight observers when called directly', () => {

    // same as previous test but target the notifyInFlightObservers method

    // simulate 2 api calls by creating a new Subject and passing it to the cache service twice.
    cacheServiceToBeTested = new CacheService();
    const subject1 = new Subject<string>();
    spyOn(subject1, 'next').and.callThrough;
    spyOn(subject1, 'complete').and.callThrough;

    subject1.subscribe({
      next: (v) => console.log(`observerA: ${v}`),
    });


    // simulate what get() method does, without the call to notifyInFlightSubscribers
    cacheServiceToBeTested.cache.set('subject1', subject1);
    cacheServiceToBeTested.inFlightObservables.set('subject1', subject1);

    cacheServiceToBeTested.notifyInFlightObservers('subject1', 'to you');

    expect(console.log).toHaveBeenCalled();
    expect(subject1.next).toHaveBeenCalled();
    expect(subject1.complete).toHaveBeenCalled();
  });

});
