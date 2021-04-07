import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { getLanguage } from './utils';
@Injectable()
export class WalletServices {

    public userToken: any;

    constructor(private http: Http) {

        this.userToken = JSON.parse(localStorage.getItem("userToken"));


    }

    getBankDetails() {

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/getBankDetails", { headers: headers })
            .map(res => res.json());


    }

    getClaimsList(userid,pageNumber,pageSize){

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        headers.append("authorization", this.userToken);

        return this.http.get(environment.BaseUrl + "user/claimDetails/"+userid+"/"+pageNumber+"/"+pageSize, { headers: headers })
            .map(res => res.json());
    }

    claimWireTransfer(instrumentId, bankName, userid, currencyType, receiptImg) {

        let fd = new FormData();

        fd.append('instrumentid', instrumentId)
        fd.append('bankname', bankName)
        fd.append('userid', userid)
        fd.append('currencyType', currencyType)
        fd.append('receipt', receiptImg)


        let headers = new Headers();
        headers.append('authorization', this.userToken);
        headers.append('accept-language', getLanguage());
        let options = new RequestOptions({ headers: headers });

        return this.http.post(environment.BaseUrl + "user/claimwiretransfer", fd, options)
            .map(res => res.json());
    }

    getAddressesForWallets(userId, currencyType) {

        var data;
        
        data = { userid: userId, currencytype: currencyType };

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        headers.append("authorization", this.userToken);
        
        return this.http.post(environment.BaseUrl + "user/getAddresses", data, { headers: headers })
            .map(res => res.json());
    }

    withDrawWallet(data) {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append("authorization", this.userToken);
        
        return this.http.post(environment.BaseUrl + "user/withdrawal", data, { headers: headers })
            .map(res => res.json());
    }
    transactionDetails(data){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append("authorization", this.userToken);
        
        return this.http.post(environment.BaseUrl + "user/gettransactiondetails", data , { headers: headers })
            .map(res => res.json());
    }
}