import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared';
// import { SocketService } from '../../services/socketService';
import { UserService } from '../../services/userService';
import { TranslateService } from '@ngx-translate/core';
declare var $: any;

@Component({
  selector: 'crypto-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss'],
  providers: [UserService]
})
export class HeadComponent implements OnInit {
  public mainLoader = false;
  public userObject: any;
  public openSidebar = true;
  public selectedLang = 'es';
  public notificationCount = 0;
  public notificationsLoader = true;
  public mql = window.matchMedia('(max-width: 767px)');

  public imgSpanish = '../../../assets/img/esp.png';
  public imgEnglish = '../../../assets/img/eng.png';
  userName: string;
  public notificationList = [];
  constructor(
    private translate: TranslateService,
    public changeDet: ChangeDetectorRef,
    public router: Router,
    public _sharedService: SharedService,
    public userService: UserService,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    if (this.mql.matches) {
      this.openSidebar = false;
    } else {
      this.openSidebar = true;
    }
    $('.list-unstyled li').removeClass('active');

    $('.notification-btn').on('click', function (e) {
      $(this).next().toggle();
    });
    $('.notifications-tab.keep-open').on('click', function (e) {
      e.stopPropagation();
    });

    if (1) {
      $('body').attr('tabindex', '0');
    } else {
    }

    this.userObject = JSON.parse(localStorage.getItem('userObject'));
    console.log(this.userObject);
    this.userName = this.userObject['Name'];
    // if (this.userObject) {
    //   this._ngZone.run(() => {
    //     if (this.userObject.Language == 'en') {
    //       $('#dropdownMenu1').css(
    //         'background-image',
    //         'url(' + this.imgEnglish + ')'
    //       );
    //       $('#dropdownMenu2').css(
    //         'background-image',
    //         'url(' + this.imgEnglish + ')'
    //       );
    //       $('.change-lang').html(
    //         'This website uses cookies to ensure you get the best experience on our website.'
    //       );
    //       $('#linking').html('Read More');
    //       $('#allow').html('Allow Cookies');
    //     } else {
    //       $('#dropdownMenu1').css(
    //         'background-image',
    //         'url(' + this.imgSpanish + ')'
    //       );
    //       $('#dropdownMenu2').css(
    //         'background-image',
    //         'url(' + this.imgSpanish + ')'
    //       );
    //       $('.change-lang').html(
    //         'Este sitio web utiliza Cookies para que tengas la mejor experiencia al navegar.'
    //       );
    //       $('#linking').html('Ver mas detalles');
    //       $('#allow').html('Permitir Cookies');
    //     }
    //     this.selectedLang = this.userObject.Language;
    //     if (this.selectedLang) {
    //       this.translate.use(this.selectedLang);
    //     } else {
    //       this.translate.use('es');
    //     }
    //   });
    // }

    this._sharedService.changeEmittedForLoader$.subscribe((a) => {
      this.mainLoader = a;
      this.changeDet.detectChanges();
    });
    window.onscroll = () => {
      if (this.mql.matches) {
        this.openSidebar = false;
      }
    };
    this._sharedService.changeEmittedForUserUpdation$.subscribe((a) => {
      console.log(a);

      this.userObject = a;
      this.selectedLang = this.userObject.Language;
      if (this.userObject.Language == 'en') {
        $('#dropdownMenu1').css(
          'background-image',
          'url(' + this.imgEnglish + ')'
        );
        $('#dropdownMenu2').css(
          'background-image',
          'url(' + this.imgEnglish + ')'
        );
        $('#linking').html('Read More');
      } else {
        $('#dropdownMenu1').css(
          'background-image',
          'url(' + this.imgSpanish + ')'
        );
        $('#dropdownMenu2').css(
          'background-image',
          'url(' + this.imgSpanish + ')'
        );
        $('#linking').html('Ver mas detalles');
      }
    });

    // if (this.userObject) {
    //   this.socketService.ConnectSocket(this.userObject.Email);
    //   this.socketService.JoinInvestorRoom("JoinInvestorRoom");
    //   this.socketService.getNewUser().subscribe((newUser) => {

    //     this.notificationCount = this.notificationCount + 1;
    //   });
    //   this.socketService.getNewTransaction().subscribe((newTransaction) => {

    //     this.notificationCount = this.notificationCount + 1;
    //   });
    //   this.socketService.getICOStageUpdationUser().subscribe((ICOStage) => {

    //     this.notificationCount = this.notificationCount + 1;
    //   });
    //   this.socketService.getKYCStatus().subscribe((KYCStatus) => {

    //     this.notificationCount = this.notificationCount + 1;
    //   })
    //   this.socketService.getNewAffiliationInvestmentTransaction().subscribe((AffiliationInvestment) => {

    //     this.notificationCount = this.notificationCount + 1;
    //   })
    //   this.socketService.getWireTransferStatus().subscribe((WireTransferstatus) => {

    //   })
    this.userService.getNotifications(1, 5).subscribe((response) => {
      this.notificationList = response.data.list;
      this.notificationCount = response.data.count;
      this._sharedService.getHeaderNotifications(this.notificationCount);
    });
    // }

    this._sharedService.changeEmittedForNotificationsCount$.subscribe((a) => {
      this.notificationCount = a;
    });
  }

  switchLanguage(language) {
    if (language == 'en') {
      $('#dropdownMenu1').css(
        'background-image',
        'url(' + this.imgEnglish + ')'
      );
      $('#dropdownMenu2').css(
        'background-image',
        'url(' + this.imgEnglish + ')'
      );
      $('#linking').html('Read More');
    } else {
      $('#dropdownMenu1').css(
        'background-image',
        'url(' + this.imgSpanish + ')'
      );
      $('#dropdownMenu2').css(
        'background-image',
        'url(' + this.imgSpanish + ')'
      );
      $('#linking').html('Ver mas detalles');
    }

    if (language) {
      this.translate.use(language);
      this.userObject.Language = language;
      localStorage.setItem('userObject', JSON.stringify(this.userObject));
      this._sharedService.updateApplicationLanguage(this.userObject.Language);
    } else {
      this.translate.use('es');
      this.userObject.Language = 'es';
      localStorage.setItem('userObject', JSON.stringify(this.userObject));
      this._sharedService.updateApplicationLanguage('es');
    }

    this.userService.updateLanguage(this.userObject.UserId, language).subscribe(
      (res) => {
        this.userObject.Language = res.data.lang;
        localStorage.setItem('userObject', JSON.stringify(this.userObject));
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  navigateToNotificationsList() {
    $('.notifications-tab').hide();
    this._sharedService.getAllNotifications(true);
    this._sharedService.getHeaderNotifications(this.notificationCount);
    this.router.navigate(['home/notifications']);
  }

  fetchNotifications() {
    this.notificationsLoader = true;
    this.userService.getNotifications(1, 5).subscribe((response) => {
      this.notificationsLoader = false;
      this.notificationList = response.data.list;
      this.notificationCount = response.data.count;
    });
  }

  updateNotificationStatus(notificationId) {
    const notitificationObj = this.notificationList.find(
      (x) => x._id == notificationId
    );
    if (notitificationObj) {
      if (this.notificationCount > 0) {
        this.notificationCount = this.notificationCount - 1;
      }
      this.userService
        .updateNotificationStatus(notificationId)
        .subscribe((response) => {
          const index = this.notificationList.findIndex(
            (x) => x._id == notificationId
          );
          this.notificationList[index].IsRead = true;
        });
    }
  }

  navigateToFaqs() {
    if (this.mql.matches) {
      this.closeSidebar();
    }
    this.router.navigate(['/home/faqs']);
  }
  NavigateToSettings() {
    if (this.mql.matches) {
      this.closeSidebar();
    }
    this.router.navigate(['/home/settings']);
  }
  navigateToICO() {
    this.router.navigate(['/home/ilo']);
  }

  navigateToDashboard() {
    if (this.mql.matches) {
      this.closeSidebar();
    }
    this.router.navigate(['/home/dashboard']);
  }
  navigateToWallet() {
    this.router.navigate(['/home/my-wallet']);
  }
  navigateToPiptleWallet() {
    this.router.navigate(['/home/wallet']);
  }

  navigateToWireTransfer() {
    this.router.navigate(['/home/wire-transfer']);
  }

  navigateToAffiliates() {
    if (this.mql.matches) {
      this.closeSidebar();
    }
    this.router.navigate(['/home/affiliate']);
  }

  navigateToProfile() {
    this.router.navigate(['/home/profile']);
  }

  closeSidebar() {
    this.openSidebar = !this.openSidebar;
  }
  sidebarClose() {
    if (this.mql.matches) {
      this.openSidebar = false;
    }
  }
  checkScroll() {
    console.log('scrolling....');
  }
  logout() {
    const dd = document.getElementById('mainLangDD');
    if (dd) {
      dd.style.display = 'block';
    }
    localStorage.clear();
    this.router.navigate(['/sign-in']);
  }

  openMailer() {
    window.open('mailto:info@fruture.com');
  }
}
