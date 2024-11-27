import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ShowToast } from '../../showtoast';
import { Validations } from '../../validations';
import { UserService } from '../../services/userService';
import { TranslateService } from '@ngx-translate/core';
import { takeWhile } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared';

declare var $: any;
@Component({
  selector: 'verify-email',
  providers: [UserService],
  styleUrls: [
    './verifyEmail.component.css' /*  './demo.css', './normalize.css', 'revealer.css', './pater.css' */,
  ],
  templateUrl: './verifyEmail.component.html',
})
export class VerifyEmail implements OnInit, OnDestroy {
  public isAlive = true;
  public localState: any;

  public showToast: ShowToast;

  public email: string;

  public emptyEmailCheck = false;

  public validEmailCheck = false;

  public ValidationsClass: Validations;

  public noError = false;

  public errorOccurred = false;

  public resendCode = false;

  public errorInVerify = false;

  public errorVerify = false;

  public tokenOfUser: any;

  public resendVerification = false;

  public resendLoader = false;

  public actionBtnShow = true;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _userService: UserService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private _sharedService: SharedService
  ) {
    this.ValidationsClass = new Validations();

    this.showToast = new ShowToast();
  }

  resendVerificationCode() {
    this.actionBtnShow = false;
    this.resendLoader = true;
    this._userService.resendEmailToUser(this.email).subscribe(
      (a) => {
        if (a.code == 200) {
          this.errorOccurred = false;
          this.noError = false;
          this.resendCode = true;
          this.actionBtnShow = true;
          this.resendLoader = false;
          this.resendVerification = false;
        }
      },
      (err) => {
        this.noError = false;
        this.resendCode = false;
        const obj = JSON.parse(err._body);
        this.errorInVerify = true;
        this.errorVerify = obj.message;
        this.errorOccurred = true;
        this.actionBtnShow = true;
        this.resendLoader = false;
      }
    );
  }

  public ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.tokenOfUser = params['token'];

      this._userService.VerifyEmail(this.tokenOfUser).subscribe(
        (a) => {
          if (a.code == 200) {
            this.errorInVerify = false;
            this.noError = true;
            this.errorOccurred = false;
            /*    $("#success-msg").text(a.message); */

            setTimeout(() => {
              this.router.navigate(['/']);
            }, 7000);
          } else if (a.code == 202) {
            this.resendVerification = true;
            this.errorInVerify = false;
            this.email = a.email;
          }
        },
        (err) => {
          this.noError = false;

          const obj = JSON.parse(err._body);

          $('#reason').html(obj.message);
          $('#reason').show();

          if (obj.code == 400) {
            this.errorInVerify = true;
            this.errorVerify = obj.message;

            setTimeout(() => {
              this.router.navigate(['/']);
            }, 10000);
          }

          this.errorOccurred = true;
        }
      );
    });

    this._sharedService.updateLanguage$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((res) => {
        const lang = localStorage.getItem('language');
        if (lang) {
          this.translate.use(lang);
        } else {
          this.translate.use('es');
        }
      });
    const lang = localStorage.getItem('language');
    if (lang) {
      this.translate.use(lang);
    } else {
      this.translate.use('es');
    }
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
