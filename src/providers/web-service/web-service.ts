import { Injectable } from '@angular/core';
import { Http} from '@angular/http';

@Injectable()
export class WebServiceProvider {

  constructor(public http: Http) {
    console.log('Hello WebServiceProvider Provider');
  }

  paymentHandler(data) {
    return new Promise((resolve, reject) => {
      this.http.post('https://apitest.authorize.net/xml/v1/request.api', data)
        .subscribe(resp => {
          resolve(resp.json());
        }, (err) => {
          reject(err);
        })
    });
  }

}
