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
        console.error('ERROR WA' + error.toString());
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
    expect(console.log).toHaveBeenCalled();
  });


  // fit('notifies in flight observers when called directly', () => {

  //   // same as previous test but target the notifyInFlightObservers method

  //   // simulate 2 api calls by creating a new Subject and passing it to the cache service twice.
  //   cacheServiceToBeTested = new CacheService();
  //   const subject1 = new Subject<string>();
  //   spyOn(subject1, "observed").and.callThrough;
  //   subject1.subscribe({
  //     next: (v) => {
  //       //console.log(`observer: ${v}`),
  //     }
  //   });


  //   subject1.subscribe(value => {
  //       //console.log('got a value from my subscription:', value)
  //     });


  //   // simulate what get() method does, without the call to notifyInFlightSubscribers
  //   cacheServiceToBeTested.cache.put('subject1', subject1);
  //   cacheServiceToBeTested.inFlightObservables.put('subject1', subject1);
  //   subject1.next('hello');

  //   cacheServiceToBeTested.notifyInFlightObservers('subject1', 'to you');



  //   expect(subject1.observed).toHaveBeenCalled();
  //   expect(console.log).toHaveBeenCalled();
  // });

});
