import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { getLanguage } from './utils';
@Injectable()
export class WalletServices {
  public userToken: any;

  constructor(private http: Http) {
    this.userToken = JSON.parse(localStorage.getItem('userToken'));
  }

  getBankDetails() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .get(environment.BaseUrl + 'user/getBankDetails', { headers: headers })
      .map((res) => res.json());
  }

  getClaimsList(userid, pageNumber, pageSize) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .get(
        environment.BaseUrl +
          'user/claimDetails/' +
          userid +
          '/' +
          pageNumber +
          '/' +
          pageSize,
        { headers: headers }
      )
      .map((res) => res.json());
  }

  claimWireTransfer(instrumentId, bankName, userid, currencyType, receiptImg) {
    const fd = new FormData();

    fd.append('instrumentid', instrumentId);
    fd.append('bankname', bankName);
    fd.append('userid', userid);
    fd.append('currencyType', currencyType);
    fd.append('receipt', receiptImg);

    const headers = new Headers();
    headers.append('authorization', this.userToken);
    headers.append('accept-language', getLanguage());
    const options = new RequestOptions({ headers: headers });

    return this.http
      .post(environment.BaseUrl + 'user/claimwiretransfer', fd, options)
      .map((res) => res.json());
  }

  getAddressesForWallets(userId, currencyType) {
    let data;

    data = { userid: userId, currencytype: currencyType };

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .post(environment.BaseUrl + 'user/getAddresses', data, {
        headers: headers
      })
      .map((res) => res.json());
  }

  withDrawWallet(data) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', this.userToken);

    return this.http
      .post(environment.BaseUrl + 'user/withdrawal', data, { headers: headers })
      .map((res) => res.json());
  }
  transactionDetails(data) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', this.userToken);

    return this.http
      .post(environment.BaseUrl + 'user/gettransactiondetails', data, {
        headers: headers
      })
      .map((res) => res.json());
  }
  stakeCoins(data) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', this.userToken);

    return this.http
      .post(environment.BaseUrl + 'user/stakeTokens', data, {
        headers: headers
      })
      .map((res) => res.json());
  }
  transferCoins(data) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', this.userToken);

    return this.http
      .post(environment.BaseUrl + 'user/transfer/tokens', data, {
        headers: headers
      })
      .map((res) => res.json());
  }
  stakingHistory() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', this.userToken);

    return this.http
      .get(environment.BaseUrl + 'user/stakingHistory', { headers: headers })
      .map((res) => res.json());
  }
  rewardHistory() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', this.userToken);

    return this.http
      .get(environment.BaseUrl + 'user/stakingRewardHistory', {
        headers: headers
      })
      .map((res) => res.json());
  }
}
