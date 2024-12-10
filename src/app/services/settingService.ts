import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class SettingService {
  public userToken: any;

  constructor(private http: Http) {
    this.userToken = JSON.parse(localStorage.getItem('userToken'));
  }
}
