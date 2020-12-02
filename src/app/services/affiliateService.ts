import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { getLanguage } from './utils';

@Injectable()
export class AffilliateService {

    public userToken: any;

    constructor(private http: Http) {

        this.userToken = JSON.parse(localStorage.getItem("userToken"));
       

    }


    getAffiliatesGraph(userid,filter){
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/getAffiliatesGraph/"+userid+"/"+ filter, { headers: headers })
            .map(res => res.json());
    }


    getAffiliateEarnings(userid,pageNo,PageSize){

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/affiliateearning/"+userid+"/"+pageNo+"/"+PageSize, { headers: headers })
            .map(res => res.json());
    }

    getCsvData(userid){
        
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/getaffiliatescsv/"+userid, { headers: headers })
            .map(res => res.json());
    }

    getTopReferrals() {


        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/gettopreferrals", { headers: headers })
            .map(res => res.json());

    }

    getMyAffiliates(userId,pageNumber,pageSize) {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage())
        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/allreferrals/"+userId+"/"+pageNumber+"/"+pageSize, { headers: headers })
            .map(res => res.json());
    }
    
    /* getMyAffiliates(userId) {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');

        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/allreferrals/"+userId, { headers: headers })
            .map(res => res.json());
    } */

}

