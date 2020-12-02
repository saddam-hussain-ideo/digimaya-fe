import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class SharedService {
  constructor(private http: Http) {

  }

  private showLoader = new Subject<any>();
  private ChangeUserObject =  new Subject<any>();
  private setInvestedData = new Subject<any>();
  private NotificationsCount = new Subject<any>();
  private notificationsCountHeader = new Subject<any>();
  private navigationSeeAll = new Subject<any>();
  private updateLanguage = new Subject<any>();
  private updateAppLang = new Subject<any>();

  changeEmittedForLoader$ = this.showLoader.asObservable();
  changeEmittedForUserUpdation$ = this.ChangeUserObject.asObservable();
  changeEmittedForInvestedData$ = this.setInvestedData.asObservable();
  changeEmittedForNotificationsCount$ = this.NotificationsCount.asObservable();
  callSeeAllNotificationsFunction$ = this.navigationSeeAll.asObservable();
  changeEmittedFornotificationsCountHeader$ = this.notificationsCountHeader.asObservable();
  updateAppLang$ = this.updateAppLang.asObservable();
  updateLanguage$ = this.updateLanguage.asObservable();



 


  changeNotificationsCount(value) {
    this.NotificationsCount.next(value); 
  }

  showHideLoader(showHide){
    this.showLoader.next(showHide);
  }

  changeUserObject(value){
    this.ChangeUserObject.next(value);
  }

  saveInvestedValues(value){
    this.setInvestedData.next(value);
  }

  getAllNotifications(value){
    this.navigationSeeAll.next(value);
  }

  getHeaderNotifications(value){
    this.notificationsCountHeader.next(value);
  }

  updateLang(lang) {
    this.updateLanguage.next(lang)
  }

  updateApplicationLanguage(lang) {
    this.updateAppLang.next(lang)
  }

}