import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { Validations } from '../../validations';
import { UserService } from '../../services/userService';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
import { takeWhile } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared';

declare var $: any;

@Component({
  selector: 'user-setup',
  providers: [UserService],
  styleUrls: ['./user-setup.component.scss'],
  templateUrl: './user-setup.component.html'
})
export class UserSetup implements OnInit, OnDestroy {
  @ViewChild(RecaptchaComponent) reCaptcha: RecaptchaComponent;

  public localState: any;

  public isAlive = true;
  public email: string;

  public noPasswordMatch = false;

  public noPassword = false;

  public confrimPassword: string;

  public noCpassword = false;

  public ValidationsClass: Validations;

  public signUpLoaderShow = false;

  public noCode = false;

  public password: string;

  public userName: string;

  public code: string;

  public actionBtnShow = true;

  public tokenForUser: any;

  public captchaKey: any;

  public config: ToasterConfig = new ToasterConfig({ animation: 'flyRight' });

  public lang;
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

    if (!this.ValidationsClass.verifyNameInputs(this.userName)) {
      error = true;
      this.lang == 'en'
        ? this.toasterService.pop('error', 'Error', 'Please enter a username')
        : this.toasterService.pop(
            'error',
            'Error',
            'Favor de ingresar un usuario valido'
          );
    } else if (!this.ValidationsClass.verifyUserNameLength(this.userName)) {
      error = true;
      this.lang == 'en'
        ? this.toasterService.pop(
            'error',
            'Error',
            'Username should be between 3-20 characters'
          )
        : this.toasterService.pop(
            'error',
            'Error',
            'El nombre de usuario debe tener entre 3 y 20 caracteres'
          );
    } else {
      if (!this.ValidationsClass.verifyUsername(this.userName)) {
        error = true;
        this.lang == 'en'
          ? this.toasterService.pop(
              'error',
              'Error',
              'Username should be alphanumeric with only one underscore as a special character.'
            )
          : this.toasterService.pop(
              'error',
              'Error',
              'El nombre de usuario debe ser alfanumérico y solo un guion bajo como carácter especial'
            );
      }
    }

    if (error) {
    } else {
      this.signUpLoaderShow = true;
      this.actionBtnShow = false;

      this._userService
        .SetPasswordForNewUser(this.tokenForUser, this.userName, this.password)
        .subscribe(
          (a) => {
            if (a.code == 200) {
              this.signUpLoaderShow = false;

              this.toasterService.pop(
                'success',
                'Satisfactorioamente',
                a.message
              );
              this.actionBtnShow = true;
              localStorage.setItem('newUserToken', null);
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 1500);
            }
          },
          (err) => {
            const obj = JSON.parse(err._body);

            this.toasterService.pop('error', 'Error', obj.message);

            this.signUpLoaderShow = false;
            this.actionBtnShow = true;
          }
        );
    }
  }

  resetErrors() {
    this.noPassword = false;
    this.noCpassword = false;
    this.noPasswordMatch = false;
    this.noCode = false;
  }

  public ngOnInit() {
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
}
