import { PaymentInstructionResolver } from './payment-instruction.resolver';
import { PaymentslogService } from '../../core/services/paymentslog/paymentslog.service';
import { FeatureService } from '../services/feature/feature.service';
import { instance, mock } from 'ts-mockito';
import { Observable } from 'rxjs';
import { BarHttpClient } from '../services/httpclient/bar.http.client';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

describe('PaymentInstructionResolver', () => {
    let paymentslogService: PaymentslogService;
    let featureService: FeatureService;
    let http: BarHttpClient;
    let httpClient: HttpClient;
    let meta: Meta;

    beforeEach(() => {
        featureService = instance(mock(FeatureService));
        spyOn(featureService, 'isFeatureEnabled').and.returnValue(
          Observable.create(observer => {
            observer.next(false);
          })
        );
        httpClient = instance(mock(HttpClient));
        meta = instance(mock(Meta));
        http = new BarHttpClient(httpClient, meta);
        paymentslogService = new PaymentslogService(http);
      });

    const directive = new PaymentInstructionResolver(paymentslogService, featureService);

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });
});
