import {
    Component,
    OnInit,
    OnDestroy,
    HostListener,
    ChangeDetectorRef
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { ShowToast } from '../../showtoast';
import { Validations } from '../../validations';
import { UserSignupModel } from '../../models/userSignup.Model';
import { WalletServices } from '../../services/walletServices';
import { SharedService } from '../../services/shared';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { UserService } from '../../services/userService';
import { AmountInvestedModel } from '../../models/amountInvestedModel';
import { DashboardService } from '../../services/dashboardService';
import { ScrollEvent } from 'ngx-scroll-event';

declare var $: any;
@Component({

    selector: 'notifications',
    providers: [WalletServices, UserService, DashboardService],
    styleUrls: ['./notifications.component.scss'],
    templateUrl: './notifications.component.html',
})
export class NotificationsComponent {
    public notificationCount = 0;
    public notificationsLoader: boolean = true;
    public notificationList = [];
    public pageNumber: number = 1;
    public pageSize = 25;
    public totalRecords: any;
    public maximumPagination: number;

    constructor(public changeDet: ChangeDetectorRef, public _userSerivce: UserService, public _sharedService: SharedService) {




    }


    getNotificationsOnScroll() {

        this.notificationsLoader = true;
        this._userSerivce.getAllNotifications(this.pageNumber, this.pageSize)
            .subscribe((response) => {
                console.log(response);
                this.totalRecords = response.data.count;
                this.maximumPagination = Math.ceil(this.totalRecords / this.pageSize);
                console.log(this.maximumPagination);
                this.notificationsLoader = false;
                for (var i = 0; i < response.data.list.length; i++) {
                    this.notificationList.push(response.data.list[i]);
                }
            })
    }




    updateNotifications(notificationId) {

        var notitificationObj = this.notificationList.find(x => x._id == notificationId);


        if (notitificationObj) {
            if (notitificationObj.IsRead == false) {

                if (this.notificationCount > 0) {

                    this.notificationCount = this.notificationCount - 1;
                    this._sharedService.changeNotificationsCount(this.notificationCount);
                }


                this._userSerivce.updateNotificationStatus(notificationId)
                    .subscribe((response) => {

                        var index = this.notificationList.findIndex(x => x._id == notificationId);
                        this.notificationList[index].IsRead = true;

                    })

            }

        }



    }



    ngOnInit() {


        var self = this;
        $(window).scroll(function () {
            if ($(window).scrollTop() + $(window).height() == $(document).height()) {

           
                if (self.pageNumber == self.maximumPagination) {
             
                    ++self.pageNumber;
                    
                } else {


                    if (self.pageNumber < self.maximumPagination) {
                        ++self.pageNumber;
                        self.getNotificationsOnScroll();
                    }

                }



            }
        });


        this._sharedService.changeEmittedFornotificationsCountHeader$.subscribe(a => {
            this.notificationCount = a;
        })

        this.getNotificationsOnScroll();

        this._sharedService.callSeeAllNotificationsFunction$.subscribe(a => {

            if (a) {
                this.pageNumber = 1;
                this.notificationList = [];
                this.getNotificationsOnScroll();
            }
        })
    }





}  