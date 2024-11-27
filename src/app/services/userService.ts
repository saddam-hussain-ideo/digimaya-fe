import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { getLanguage } from './utils';

@Injectable()
export class UserService {
  public userToken: any;

  constructor(private http: Http) {
    this.userToken = JSON.parse(localStorage.getItem('userToken'));
  }

  signUp(signupObject, captcha) {
    let data;

    data = {
      name: signupObject.fullName,
      email: signupObject.email,
      username: signupObject.username,
      password: signupObject.password,
      refferalcode: signupObject.referralCode,
      captchaKey: captcha,
      country: signupObject.country,
      phone: signupObject.mobile
    };

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    return this.http
      .post(environment.BaseUrl + 'user/signup', data, { headers: headers })
      .map((res) => res.json());
  }

  resendEmailToUser(email) {
    let data;

    data = { email: email };

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    return this.http
      .post(environment.BaseUrl + 'user/resendcode', data, { headers: headers })
      .map((res) => res.json());
  }
  saveWallet(data, token) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', token);

    return this.http
      .post(environment.BaseUrl + 'user/walletAddress', data, {
        headers: headers
      })
      .map((res) => res.json());
  }
  retrieveWallet(token) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', token);

    return this.http
      .get(environment.BaseUrl + 'user/walletAddress', { headers: headers })
      .map((res) => res.json());
  }

  kycDetails(email, token) {
    const query = `?username=${email}`;
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', token);

    return this.http
      .get(environment.BaseUrl + `user/userKycFromStore${query}`, {
        headers: headers
      })
      .map((res) => res.json());
  }

  userDetails(email, token) {
    const query = `?username=${email}`;
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', token);

    return this.http
      .get(environment.BaseUrl + `user/userInformationFromStore${query}`, {
        headers: headers
      })
      .map((res) => res.json());
  }

  signIn(email, password, captchaKey) {
    let data;

    data = { email: email, password: password, captchaKey: captchaKey };

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    return this.http
      .post(environment.BaseUrl + 'user/signin', data, { headers: headers })
      .map((res) => res.json());
  }

  VerifyEmail(token) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', token);

    return this.http
      .get(environment.BaseUrl + 'user/verify', { headers: headers })
      .map((res) => res.json());
  }

  enableDisable2FA(email, userid) {
    let data;

    data = { email: email, userid: userid };

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .post(environment.BaseUrl + 'user/enabledisabletwofa', data, {
        headers: headers
      })
      .map((res) => res.json());
  }

  authenticate2FALogin(email, twoFa) {
    let data;

    data = { email: email, code: twoFa };

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());

    return this.http
      .post(environment.BaseUrl + 'user/verifytwofa', data, {
        headers: headers
      })
      .map((res) => res.json());
  }

  authenticate2Fa(email, state, code, formattedKey, ToTpUri, userid) {
    let data;

    data = {
      email: email,
      state: state,
      code: code,
      twoFaKey: formattedKey,
      toTpUri: ToTpUri,
      userid
    };

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .post(environment.BaseUrl + 'user/enabledisabletwofa', data, {
        headers: headers
      })
      .map((res) => res.json());
  }

  ForgotPassword(email, captchaKey) {
    let data;
    data = { email: email, captchaKey: captchaKey };
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    return this.http
      .post(environment.BaseUrl + 'user/forgot', data, { headers: headers })
      .map((res) => res.json());
  }

  ResetPassword(token, password, captchaKey) {
    let data;

    data = { newPassword: password, captchaKey: captchaKey };

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', token);
    headers.append('accept-language', getLanguage());

    return this.http
      .post(environment.BaseUrl + 'user/verifyforgot', data, {
        headers: headers
      })
      .map((res) => res.json());
  }

  changePassword(oldPassword, newPassword, UserId) {
    let data;

    data = {
      oldpassword: oldPassword,
      newpassword: newPassword,
      userid: UserId
    };

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .post(environment.BaseUrl + 'user/changepassword', data, {
        headers: headers
      })
      .map((res) => res.json());
  }

  changeGeneralSettings(userid, name, ethAddress) {
    let data;

    data = { userid: userid, name: name, ethaddress: ethAddress };

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .post(environment.BaseUrl + 'user/edituserprofile', data, {
        headers: headers
      })
      .map((res) => res.json());
  }

  getCountries() {
    let data;
    data = {};
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    return this.http
      .get('https://restcountries.eu/rest/v2/all', data)
      .map((res) => res.json());
  }

  doKyc(
    userid,
    idType,
    frontImage,
    backImage,
    billType,
    billImage,
    phoneNumber,
    firstName,
    code
  ) {
    const fd = new FormData();
    fd.append('userid', userid);
    fd.append('idType', idType);
    fd.append('userPhoto', frontImage);
    fd.append('billType', billType);
    fd.append('userPhoto', billImage);
    fd.append('userPhoto', backImage);
    fd.append('phoneNumber', phoneNumber);
    fd.append('code', code);
    fd.append('firstName', firstName);

    const headers = new Headers();
    headers.append('authorization', this.userToken);
    headers.append('accept-language', getLanguage());

    return this.http
      .post(environment.BaseUrl + 'user/dokyc', fd, { headers: headers })
      .map((res) => res.json());
  }

  SetPasswordForNewUser(token, username, password) {
    let data;

    data = { token: token, username: username, password: password };

    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    headers.append('authorization', this.userToken);

    return this.http
      .post(environment.BaseUrl + 'admin/verifyadminuser', data, {
        headers: headers
      })
      .map((res) => res.json());
  }

  resendEmailForAdminSignedUpUser(email) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('accept-language', getLanguage());
    return this.http
      .get(environment.BaseUrl + 'admin/adminuserresendemail/' + email, {
        headers: headers
      })
      .map((res) => res.json());
  }

  getAllNotifications(pagenumber, pagesize) {
    const headers = new Headers();
    const token = JSON.parse(localStorage.getItem('userToken'));

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', token);
    headers.append('accept-language', getLanguage());
    return this.http
      .get(
        environment.BaseUrl +
          `user/getUserNotificationsList?pagenumber=${pagenumber}&pagesize=${pagesize}&type=all`,
        { headers: headers }
      )
      .map((res) => res.json());
  }

  getNotifications(pagenumber, pagesize) {
    const headers = new Headers();
    const token = JSON.parse(localStorage.getItem('userToken'));

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', token);
    headers.append('accept-language', getLanguage());
    return this.http
      .get(
        environment.BaseUrl +
          `user/getUserNotificationsList?pagenumber=${pagenumber}&pagesize=${pagesize}`,
        { headers: headers }
      )
      .map((res) => res.json());
  }

  updateNotificationStatus(notificationId) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', this.userToken);
    headers.append('accept-language', getLanguage());
    return this.http
      .get(
        environment.BaseUrl +
          `user/updateNotificationStatus?notificationid=${notificationId}`,
        { headers: headers }
      )
      .map((res) => res.json());
  }

  getKycStatus(userId) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', this.userToken);
    headers.append('accept-language', getLanguage());
    return this.http
      .get(environment.BaseUrl + 'user/kycstatus/' + userId, {
        headers: headers
      })
      .map((res) => res.json());
  }

  updateLanguage(userId, lang) {
    const headers = new Headers();

    let data;

    data = { userid: userId, lang: lang };

    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', this.userToken);
    headers.append('accept-language', getLanguage());
    return this.http
      .post(environment.BaseUrl + 'user/updateLang', data, { headers: headers })
      .map((res) => res.json());
  }

  getTokens(userId, token) {
    const queryParams = `?userId=${userId}`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', token);
    return this.http
      .get(`${environment.BaseUrl}user/getUserBalance${queryParams}`, {
        headers: headers
      })
      .map((res) => res.json());
  }
  singleSignOn(token, value) {
    const queryParams = `?isForCredentials=${value}`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('authorization', token);
    return this.http
      .get(`${environment.BaseUrl}user/getLoginCredentials/${queryParams}`, {
        headers: headers
      })
      .map((res) => res.json());
  }
}
