import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef
} from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { Validations } from '../../validations';
import { UserService } from '../../services/userService';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/services/shared';
import { takeWhile } from 'rxjs/operators';
import { getLanguage } from '../../services/utils';

declare var $: any;

@Component({
  selector: 'reset-password',
  providers: [UserService],
  styleUrls: ['./resetPassword.component.scss'],
  templateUrl: './resetPassword.component.html'
})
export class ResetPassword implements OnInit, OnDestroy {
  @ViewChild(RecaptchaComponent) reCaptcha: RecaptchaComponent;

  public isAlive = true;
  public localState: any;

  public email: string;

  public noPasswordMatch = false;

  public noPassword = false;

  public confrimPassword: string;

  public noCpassword = false;

  public ValidationsClass: Validations;

  public signUpLoaderShow = false;

  public noCode = false;

  public password: string;

  public code: string;

  public actionBtnShow = true;

  public tokenForUser: any;

  public captchaKey: any;

  public config: ToasterConfig = new ToasterConfig({ animation: 'flyRight' });
  public lang;
  public userObject: any;
  isShow = false;
  isConfirm = false;

  @ViewChild('passwordField') passwordInput: ElementRef;
  @ViewChild('confirmPasswordField') passwordConfirm: ElementRef;
  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    public _userService: UserService,
    private toasterService: ToasterService,
    private translate: TranslateService,
    private _sharedService: SharedService
  ) {
    this.ValidationsClass = new Validations();

    this.toasterService = toasterService;
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

    this._userService
      .ResetPassword(this.tokenForUser, this.password, this.captchaKey)
      .subscribe(
        (a) => {
          if (a.code == 200) {
            this.signUpLoaderShow = false;
            getLanguage();
            this.lang == 'en'
              ? this.toasterService.pop('success', 'Success', a.message)
              : this.toasterService.pop(
                  'success',
                  'Satisfactorioamente',
                  a.message
                );
            this.actionBtnShow = true;
            grecaptcha.reset();
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1500);
          }
        },
        (err) => {
          grecaptcha.reset();
          const obj = JSON.parse(err._body);

          this.toasterService.pop('error', 'Error', obj.message);

          this.signUpLoaderShow = false;
          this.actionBtnShow = true;
        }
      );
  }

  routeToLogin() {
    this.router.navigate(['/']);
  }

  submitResetPasswordRequestWithEnter(event) {
    if (event.keyCode == 13) {
      this.submitResetPasswordRequest();
    }
  }

  submitResetPasswordRequest() {
    let error = false;
    this.toasterService.clear();

    if (!this.ValidationsClass.verifyNameInputs(this.password)) {
      this.lang == 'en'
        ? this.toasterService.pop('error', 'Error', 'Please enter a password')
        : this.toasterService.pop(
            'error',
            'Error',
            'favor de ingresar su contraseña'
          );
      error = true;
    }

    if (!this.ValidationsClass.verifyNameInputs(this.confrimPassword)) {
      this.lang == 'en'
        ? this.toasterService.pop(
            'error',
            'Error',
            'Please enter confirm password'
          )
        : this.toasterService.pop(
            'error',
            'Error',
            'favor de confirmar su contraseña'
          );
      error = true;
    }

    if (this.password != this.confrimPassword) {
      this.lang == 'en'
        ? this.toasterService.pop(
            'error',
            'Error',
            'Your passwords do not match'
          )
        : this.toasterService.pop(
            'error',
            'Error',
            'Ambas contraseñas no coinciden'
          );
      error = true;
    }

    if (error) {
    } else {
      grecaptcha.execute();
    }
  }

  resetErrors() {
    this.noPassword = false;
    this.noCpassword = false;
    this.noPasswordMatch = false;
    this.noCode = false;
  }

  public ngOnInit() {
    this.userObject = JSON.parse(localStorage.getItem('userObject'));

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.tokenForUser = params['token'];
    });

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
  hidePassword(value) {
    if (value == 'confirm') {
      this.isConfirm = false;
      this.passwordConfirm.nativeElement.setAttribute('type', 'password');
      return;
    }
    this.isShow = false;
    this.passwordInput.nativeElement.setAttribute('type', 'password');
  }
  showPassword(value) {
    if (value == 'confirm') {
      this.isConfirm = true;
      this.passwordConfirm.nativeElement.setAttribute('type', 'text');
      return;
    }
    this.isShow = true;
    this.passwordInput.nativeElement.setAttribute('type', 'text');
  }
}
