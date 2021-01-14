import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { getLanguage } from './utils';

@Injectable()
export class UserService {

    public userToken: any;

    constructor(private http: Http) {

        this.userToken = JSON.parse(localStorage.getItem("userToken"));


    }


    signUp(signupObject, captcha) {

        var data;

        data = { name: signupObject.fullName, email: signupObject.email, username: signupObject.username, password: signupObject.password, refferalcode: signupObject.referralCode, captchaKey: captcha };


        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        return this.http.post(environment.BaseUrl + "user/signup", data, { headers: headers })
            .map(res => res.json());

    }


    resendEmailToUser(email) {

        var data;

        data = { email: email };

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        return this.http.post(environment.BaseUrl + "user/resendcode", data, { headers: headers })
            .map(res => res.json());

    }

    signIn(email, password, captchaKey) {


        var data;

        data = { email: email, password: password, captchaKey: captchaKey };

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        return this.http.post(environment.BaseUrl + "user/signin", data, { headers: headers })
            .map(res => res.json());

    }

    VerifyEmail(token) {


        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        headers.append("authorization", token);

        return this.http.get(environment.BaseUrl + "user/verify", { headers: headers })
            .map(res => res.json());
    }

    enableDisable2FA(email, userid) {

        var data;

        data = { email: email, userid: userid };

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        headers.append("authorization", this.userToken);

        return this.http.post(environment.BaseUrl + "user/enabledisabletwofa", data, { headers: headers })
            .map(res => res.json());

    }


    authenticate2FALogin(email, twoFa) {

        var data;

        data = { email: email, code: twoFa };

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());

        return this.http.post(environment.BaseUrl + "user/verifytwofa", data, { headers: headers })
            .map(res => res.json());


    }


    authenticate2Fa(email, state, code, formattedKey, ToTpUri, userid) {

        var data;

        data = { email: email, state: state, code: code, twoFaKey: formattedKey, toTpUri: ToTpUri, userid };

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        headers.append("authorization", this.userToken);

        return this.http.post(environment.BaseUrl + "user/enabledisabletwofa", data, { headers: headers })
            .map(res => res.json());

    }


    ForgotPassword(email, captchaKey) {
        var data;
        data = { email: email, captchaKey: captchaKey };
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        return this.http.post(environment.BaseUrl + "user/forgot", data, { headers: headers })
            .map(res => res.json());
    }


    ResetPassword(token, password, captchaKey) {

        var data;

        data = { newPassword: password, captchaKey: captchaKey };

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append("authorization", token);
        headers.append("accept-language", getLanguage());

        return this.http.post(environment.BaseUrl + "user/verifyforgot", data, { headers: headers })
            .map(res => res.json());
    }

    changePassword(oldPassword, newPassword, UserId) {
        var data;

        data = { oldpassword: oldPassword, newpassword: newPassword, userid: UserId };

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        headers.append("authorization", this.userToken);

        return this.http.post(environment.BaseUrl + "user/changepassword", data, { headers: headers })
            .map(res => res.json());
    }


    changeGeneralSettings(userid, name, ethAddress) {

        var data;

        data = { userid: userid, name: name, ethaddress: ethAddress };

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        headers.append("authorization", this.userToken);

        return this.http.post(environment.BaseUrl + "user/edituserprofile", data, { headers: headers })
            .map(res => res.json());
    }


    getCountries() {
        var data;
        data = {};
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        return this.http.get("https://restcountries.eu/rest/v2/all", data)
            .map(res => res.json());
    }

    doKyc(userid, idType, frontImage, backImage, billType, billImage, phoneNumber, firstName, code) {

        let fd = new FormData();
        fd.append('userid', userid);
        fd.append('idType', idType);
        fd.append('userPhoto', frontImage);
        fd.append('billType', billType);
        fd.append('userPhoto', billImage);
        fd.append('userPhoto', backImage);
        fd.append('phoneNumber', phoneNumber);
        fd.append('code', code);
        fd.append('firstName', firstName);

        let headers = new Headers();
        headers.append("authorization", this.userToken);
        headers.append("accept-language", getLanguage());


        return this.http.post(environment.BaseUrl + "user/dokyc", fd, { headers: headers })
            .map(res => res.json());

    }


    SetPasswordForNewUser(token, username, password) {

        var data;

        data = { token: token, username: username, password: password };

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        headers.append("authorization", this.userToken);


        return this.http.post(environment.BaseUrl + "admin/verifyadminuser", data, { headers: headers })
            .map(res => res.json());
    }


    resendEmailForAdminSignedUpUser(email) {

        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append('accept-language', getLanguage());
        return this.http.get(environment.BaseUrl + "admin/adminuserresendemail/" + email, { headers: headers })
            .map(res => res.json());
    }


    getAllNotifications(pagenumber, pagesize) {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append("authorization", this.userToken);
        headers.append('accept-language', getLanguage());
        return this.http.get(environment.BaseUrl + `user/getUserNotificationsList?pagenumber=${pagenumber}&pagesize=${pagesize}&type=all`, { headers: headers })
            .map(res => res.json());
    }


    getNotifications(pagenumber, pagesize) {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append("authorization", this.userToken);
        headers.append('accept-language', getLanguage());
        return this.http.get(environment.BaseUrl + `user/getUserNotificationsList?pagenumber=${pagenumber}&pagesize=${pagesize}`, { headers: headers })
            .map(res => res.json());
    }

    updateNotificationStatus(notificationId) {
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append("authorization", this.userToken);
        headers.append('accept-language', getLanguage());
        return this.http.get(environment.BaseUrl + `user/updateNotificationStatus?notificationid=${notificationId}`, { headers: headers })
            .map(res => res.json());
    }

    getKycStatus(userId){
        let headers = new Headers();

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append("authorization", this.userToken);
        headers.append('accept-language', getLanguage());
        return this.http.get(environment.BaseUrl + 'user/kycstatus/'+userId, { headers: headers })
            .map(res => res.json());
    }

    updateLanguage(userId, lang){
        let headers = new Headers();

        var data;

        data = { userid: userId, lang: lang};
    

        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append("authorization", this.userToken);
        headers.append('accept-language', getLanguage());
        return this.http.post(environment.BaseUrl + 'user/updateLang',data, { headers: headers })
            .map(res => res.json());
    }

    getTokens(userId, token){
        const queryParams = `?userId=${userId}`
        let headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');
        headers.append("authorization", token);
        return this.http.get(`${environment.BaseUrl}user/getUserBalance/${queryParams}`, { headers: headers })
        .map(res => res.json());
    }

}