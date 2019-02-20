import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WebServiceProvider } from '../../providers/web-service/web-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public apiLoginID = "YOUR_AUTHORIZE.NET_LOGIN_ID";
  public clientKey = "YOUR_AUTHORIZE.NET_CLIENT_KEY";
  public transactionKey = "YOUR_AUTHORIZE.NET_TRANSACTION_KEY";
  public amount = "AMOUNT";

  constructor(public navCtrl: NavController, private webService: WebServiceProvider) {
  }

  ionViewDidLoad() {
    setTimeout(() => {
      const s = document.createElement('script');
      s.type = "text/javascript";
      s.innerHTML = "console.log('done');"; //inline script
      s.src = "https://jstest.authorize.net/v3/AcceptUI.js";
      s.charset = "utf-8";
      document.querySelector('head').appendChild(s);
    }, 1000);

    document.removeEventListener('notification', function() { console.log('Removed!!')}); 
    const buttonElement = document.getElementById('AcceptUI');
      buttonElement.addEventListener('notification',(response: any) => {
        event.stopPropagation();
        event.preventDefault();
        // Call your api here and pass the opaque data in backend
        this.paymentHandler(response.detail.opaqueData);
        document.removeEventListener('notification', function() { console.log('Removed!!')}); 
      }, false);
  }


  paymentHandler(payData){
    // Put you api here to capture the payment data
    let data = {
      "createTransactionRequest": {
      "merchantAuthentication": {
        "name": this.apiLoginID,
        "transactionKey": this.transactionKey
    },
    "transactionRequest": {
        "transactionType": "authCaptureTransaction",
        "amount": this.amount,
        "payment": {
          "opaqueData" : payData
        }
      }
    }
  }
  this.webService.paymentHandler(data).then((response) => {
    console.log("API", response);
    alert( JSON.stringify(response));
  }).catch((error) => {
    console.log(error)
  })
}

}
// To handle response form authorize.net api
window['responseHandler'] = function responseHandler(response) {
  if (response.messages.resultCode == "Ok") {
      let event = new CustomEvent("notification", { "detail": response });
      const buttonElement = document.getElementById('AcceptUI');
      buttonElement.dispatchEvent(event);
  }
}
