import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { getLanguage } from './utils';
@Injectable()
export class ICOService {

    public userToken:any;

    constructor(private http: Http) {

        this.userToken = JSON.parse(localStorage.getItem("userToken"));
    

    }

    getStagesForBars(){
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/getIndividualStage", { headers: headers })
            .map(res => res.json());
       
    }

    getICOInformaion(){


        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/getcomplateicoinfo", { headers: headers })
            .map(res => res.json());

    }


}