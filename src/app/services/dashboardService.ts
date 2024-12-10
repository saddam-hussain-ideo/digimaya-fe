import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { getLanguage } from './utils';
@Injectable()
export class DashboardService {
  public userToken: any;

  constructor(private http: Http) {
    this.userToken = JSON.parse(localStorage.getItem('userToken'));
  }

  getAmountInvested(userId) {
    const token = JSON.parse(localStorage.getItem('userToken'));
    let data;

    data = { userid: userId };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', token);

    return this.http
      .post(environment.BaseUrl + 'user/amountinvested', data, {
        headers: headers
      })
      .map((res) => res.json());
  }

  salesGraph() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .get(environment.BaseUrl + 'user/getPiptleIssuedGraph', {
        headers: headers
      })
      .map((res) => res.json());
  }
  salesGraphWeekly() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .get(environment.BaseUrl + 'user/getPiptleIssuedGraphWeekly', {
        headers: headers
      })
      .map((res) => res.json());
  }
  getRates() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .get(environment.BaseUrl + 'user/getRates', { headers: headers })
      .map((res) => res.json());
  }

  getTransactionDetails(userId, pageNumber, pageSize) {
    const token = JSON.parse(localStorage.getItem('userToken'));
    let data;

    data = { userid: userId, pagenumber: pageNumber, pagesize: pageSize };

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', token);

    return this.http
      .post(environment.BaseUrl + 'user/gettransactiondetails', data, {
        headers: headers
      })
      .map((res) => res.json());
  }

  getLiveStats() {
    const token = JSON.parse(localStorage.getItem('userToken'));

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', token);

    return this.http
      .get(environment.BaseUrl + 'user/getlastdaytansactionsstats/', {
        headers: headers
      })
      .map((res) => res.json());
  }

  getLiveStatsForWidgets() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    return this.http
      .get(environment.BaseUrl + 'livegraph', { headers: headers })
      .map((res) => res.json());
  }

  getBlogs() {
    const token = JSON.parse(localStorage.getItem('userToken'));
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', token);

    return this.http
      .get(environment.BaseUrl + 'user/getblogDetails', { headers: headers })
      .map((res) => res.json());
  }

  getILOStages() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .get(environment.BaseUrl + 'user/geticostages', { headers: headers })
      .map((res) => res.json());
  }

  icoPiptleDetails(pageSize, pageNumber) {
    const params = `pageSize=${pageSize}&pageNumber=${pageNumber}`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .get(environment.BaseUrl + `user/iloPiptlesDetails?${params}`, {
        headers: headers
      })
      .map((res) => res.json());
  }
}
