import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Validations } from '../../validations';
import { UserSignupModel } from '../../models/userSignup.Model';
import { UserService } from '../../services/userService';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
import { takeWhile } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared';
import { getLanguage } from '../../services/utils';

declare var $: any;
@Component({
  selector: 'forgot-password',
  providers: [UserService],
  styleUrls: [
    './forgotPassword.component.scss' /*  './demo.css', './normalize.css', 'revealer.css', './pater.css' */
  ],
  templateUrl: './forgotPassword.component.html'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  @ViewChild(RecaptchaComponent) reCaptcha: RecaptchaComponent;

  public isAlive = true;
  public localState: any;

  public userObject: any;

  public email: string;

  public emptyEmailCheck = false;

  public validEmailCheck = false;

  public ValidationsClass: Validations;

  public signUpLoaderShow = false;

  public captchaKey: any;

  public actionBtnShow = true;

  public config: ToasterConfig = new ToasterConfig({ animation: 'flyRight' });

  public lang;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _userService: UserService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    private _sharedService: SharedService
  ) {
    this.ValidationsClass = new Validations();
    this.toasterService = toasterService;
  }

  routeToLogin() {
    this.router.navigate(['/sign-in']);
  }

  submitEmailForForgotPasswordWithEnter(event) {
    if (event.keyCode == 13) {
      this.submitEmailForForgotPassword();
    }
  }

  submitCaptcha(captchaResponse: string) {
    this.captchaKey = null;

    this.captchaKey = captchaResponse;

    if (this.captchaKey == null || this.captchaKey == undefined) {
    } else {
      this.actualCode();
    }
  }

  actualCode() {
    this.signUpLoaderShow = true;
    this.actionBtnShow = false;

    this._userService.ForgotPassword(this.email, this.captchaKey).subscribe(
      (a) => {
        if (a.code == 200) {
          localStorage.setItem('token', a.token);
          this.email = undefined;
          getLanguage();
          this.lang == 'en'
            ? this.toasterService.pop('success', 'Success', a.message)
            : this.toasterService.pop(
                'success',
                'Satisfactorioamente',
                a.message
              );

          this.signUpLoaderShow = false;
          this.actionBtnShow = true;
          grecaptcha.reset();
        }
      },
      (err) => {
        const obj = JSON.parse(err._body);
        this.toasterService.pop('error', 'Error', obj.message);
        this.signUpLoaderShow = false;
        this.actionBtnShow = true;
        grecaptcha.reset();
      }
    );
  }

  submitEmailForForgotPassword() {
    let error = false;
    this.toasterService.clear();

    if (!this.ValidationsClass.verifyNameInputs(this.email)) {
      this.lang == 'en'
        ? this.toasterService.pop('error', 'Error', 'Email Cannot be Empty')
        : this.toasterService.pop(
            'error',
            'Error',
            'El correo electrónico no puede estar vacío'
          );
      error = true;
    } else {
      if (!this.ValidationsClass.validateEmail(this.email)) {
        this.lang == 'en'
          ? this.toasterService.pop(
              'error',
              'Error',
              'Email should be a Valid email'
            )
          : this.toasterService.pop(
              'error',
              'Error',
              'Ingrese un correo electrónico válido'
            );
        error = true;
      }
    }

    if (error) {
    } else {
      grecaptcha.execute();
    }
  }

  signUpOnEnter(event) {
    if (event.keyCode == 13) {
      this.signUp();
    }
  }

  resetErrors() {
    this.validEmailCheck = false;
    this.emptyEmailCheck = false;
  }

  signUp() {}

  public ngOnInit() {
    this.userObject = JSON.parse(localStorage.getItem('userObject'));

    if (localStorage.getItem('userToken')) {
      this.router.navigate(['/home/dashboard']);
    }

    this._sharedService.updateLanguage$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((res) => {
        this.lang = localStorage.getItem('language');
        if (this.lang) {
          this.translate.use(this.lang);
        } else {
          this.translate.use('es');
        }
      });

    this.lang = localStorage.getItem('language');
    if (this.lang) {
      this.translate.use(this.lang);
    } else {
      this.translate.use('es');
    }
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
