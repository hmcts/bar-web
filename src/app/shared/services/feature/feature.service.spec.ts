import { HttpClient } from '@angular/common/http';
import { FeatureService } from './feature.service';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import Feature from '../../models/feature.model';

const response = `
[
  {
      "uid": "payment-actions-return",
      "enable": true,
      "description": "Available actions for payment",
      "group": null,
      "permissions": [],
      "flippingStrategy": null,
      "customProperties": {}
  },
  {
      "uid": "payment-actions-suspense",
      "enable": false,
      "description": "Available actions for payment",
      "group": null,
      "permissions": [],
      "flippingStrategy": null,
      "customProperties": {}
  },
  {
      "uid": "payment-actions-refund",
      "enable": true,
      "description": "Available actions for payment",
      "group": null,
      "permissions": [],
      "flippingStrategy": null,
      "customProperties": {}
  },
  {
      "uid": "payment-actions-suspence-deficiency",
      "enable": true,
      "description": "Available actions for payment",
      "group": null,
      "permissions": [],
      "flippingStrategy": null,
      "customProperties": {}
  },
  {
      "uid": "payment-actions-process",
      "enable": false,
      "description": "Available actions for payment",
      "group": null,
      "permissions": [],
      "flippingStrategy": null,
      "customProperties": {}
  }
]
`;

describe('FeatureService', () => {
  let featureService: FeatureService;
  let http: HttpClient;

  beforeEach(() => {
    http = instance(mock(HttpClient));
    spyOn(http, 'get').and.callFake(() => {
      return {
        toPromise: () => {
          return Promise.resolve(JSON.parse(response));
        }
      };
    });
    spyOn(http, 'put').and.callFake((url, feature) => {
      return {
        toPromise: () => {
          return Promise.resolve({url, feature});
        }
      };
    });
    featureService = new FeatureService(http);
  });

  it('collect all the features', done => {
    featureService.findAllFeatures()
      .then(res => {
        expect(res.length).toEqual(5);
        expect(res[0].uid).toBe('payment-actions-return');
        done();
      });
  });

  it('send feature to update', done => {
    const featureToUpdate: Feature = JSON.parse(response)[0];
    featureToUpdate.enable = false;
    featureService.updateFeature(featureToUpdate)
      .then(resp => {
        expect(resp.url).toBe('http://localhost:3000/api/features/payment-actions-return');
        expect(resp.feature.enable).toBeFalsy();
        done();
      });
  });

  it('check if a feature is enabled', done => {
    featureService.isFeatureEnabled('payment-actions-return')
      .then(result => {
        expect(result).toBeTruthy();
        done();
      });
  });

  it('check if a feature is disabled', done => {
    featureService.isFeatureEnabled('payment-actions-suspense')
      .then(result => {
        expect(result).toBeFalsy();
        done();
      });
  });
});
