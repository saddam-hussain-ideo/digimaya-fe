import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { getLanguage } from './utils';
@Injectable()
export class DashboardService {



    public userToken: any;


    constructor(private http: Http) {

        this.userToken = JSON.parse(localStorage.getItem("userToken"));
    }


    getAmountInvested(userId) {
        let token = JSON.parse(localStorage.getItem("userToken"));        
        var data;

        data = { userid: userId };


        let headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", token);

        return this.http.post(environment.BaseUrl + "user/amountinvested", data, { headers: headers })
            .map(res => res.json());

    }


    getRates() {

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/getRates", { headers: headers })
            .map(res => res.json());

    }



    getTransactionDetails(userId, pageNumber, pageSize) {
        let token = JSON.parse(localStorage.getItem("userToken"));        
        var data;

        data = { userid: userId, pagenumber: pageNumber, pagesize: pageSize };

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", token);

        return this.http.post(environment.BaseUrl + "user/gettransactiondetails", data, { headers: headers })
            .map(res => res.json());
    }


    getLiveStats() {
        let token = JSON.parse(localStorage.getItem("userToken"));        

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", token);

        return this.http.get(environment.BaseUrl + "user/getlastdaytansactionsstats/", { headers: headers })
            .map(res => res.json());
    }


    getLiveStatsForWidgets() {

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        return this.http.get(environment.BaseUrl + "livegraph", { headers: headers })
            .map(res => res.json());
    }


    

    getBlogs() {
        let token = JSON.parse(localStorage.getItem("userToken"));        
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", token);

        return this.http.get(environment.BaseUrl + "user/getblogDetails", { headers: headers })
            .map(res => res.json());
    }

    getILOStages() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/geticostages", { headers: headers })
            .map(res => res.json());
    }
}