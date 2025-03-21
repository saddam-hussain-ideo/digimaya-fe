import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { getLanguage } from './utils';

@Injectable()
export class AffilliateService {
  public userToken: any;

  constructor(private http: Http) {
    this.userToken = JSON.parse(localStorage.getItem('userToken'));
  }

  getAffiliatesGraph(userid, filter) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .get(
        environment.BaseUrl +
          'user/getAffiliatesGraph/' +
          userid +
          '/' +
          filter,
        { headers: headers }
      )
      .map((res) => res.json());
  }

  getAffiliateEarnings(userid, pageNo, PageSize) {
    const queryParams = `userId=${userid}&pageSize=${PageSize}&pageNumber=${pageNo}`;
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .get(`${environment.BaseUrl}user/affiliateearning?${queryParams}`, {
        headers: headers
      })
      .map((res) => res.json());
  }

  getCsvData(userid) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .get(environment.BaseUrl + 'user/getaffiliatescsv/' + userid, {
        headers: headers
      })
      .map((res) => res.json());
  }

  getTopReferrals(pageNumber, pageSize, userId) {
    const queryParams = `?userId=${userId}`;
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .get(environment.BaseUrl + `user/gettopreferrals${queryParams}`, {
        headers: headers
      })
      .map((res) => res.json());
  }

  getMyAffiliates(userId, pageNumber, pageSize) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .get(
        environment.BaseUrl +
          'user/allreferrals/' +
          userId +
          '/' +
          pageNumber +
          '/' +
          pageSize,
        { headers: headers }
      )
      .map((res) => res.json());
  }

  /* getMyAffiliates(userId) {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');

        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/allreferrals/"+userId, { headers: headers })
            .map(res => res.json());
    } */
  levelReferrals(userId, level, pageNo, pageSize) {
    const params = `?userId=${userId}&level=${level}&pageNumber=${pageNo}&pageSize=${pageSize}`;
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');

    headers.append('authorization', this.userToken);

    return this.http
      .get(environment.BaseUrl + `user/getreferrals${params}`, {
        headers: headers
      })
      .map((res) => res.json());
  }

  getSupportedChains() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', this.userToken);

    return this.http
      .get(`${environment.BaseUrl}getSupportedChains`, {
        headers: headers
      })
      .map((res) => res.json());
  }

  getWithdrawalHistory(pageNo, pageSize) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', this.userToken);

    const params = `?pageNumber=${pageNo}&pageSize=${pageSize}`;

    return this.http
      .get(`${environment.BaseUrl}user/getWithdrawalHistory${params}`, {
        headers: headers
      })
      .map((res) => res.json());
  }

  withdraw(address, amount, chain) {
    const headers = new Headers();
    const data = {
      address: address,
      amount: amount,
      chain: chain
    };
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', this.userToken);

    return this.http
      .post(environment.BaseUrl + 'user/referral/withdrawal', data, {
        headers: headers
      })
      .map((res) => res.json());
  }
}
