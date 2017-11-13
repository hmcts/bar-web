import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable()
export class PaymenttypeService {

	constructor(private http: HttpClient) {}

	getPaymentTypes() {
		return this.http
			.get('http://localhost:8080/payment-types')
			.toPromise()
	}

	createPostPayment(data) {
		return this.http
			.post('http://localhost:8080/payments', data)
			.toPromise()
	}

}
