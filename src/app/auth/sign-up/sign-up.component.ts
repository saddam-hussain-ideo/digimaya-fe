import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef
} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

import { Validations } from '../../validations';
import { UserSignupModel } from '../../models/userSignup.Model';
import { UserService } from '../../services/userService';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { takeWhile } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared';
import file from '../../../assets/countries/countries';
declare var $: any;

@Component({
  selector: 'crypto-sign-up',
  providers: [UserService],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  @ViewChild(RecaptchaComponent) reCaptcha: RecaptchaComponent;

  public isAlive = true;
  public localState: any;

  public captchaKey = null;

  public SignUpObject: UserSignupModel;

  public emptyEmailCheck = false;

  public validEmailCheck = false;

  public emptyfullName = false;

  public epmtyLName = false;

  /*   public ethCheck: boolean = false; */

  public validPasswordCheck = false;

  public validCPasswordCheck = false;

  public ValidationsClass: Validations;

  public passwordsMatch = false;

  public userObject: UserSignupModel;

  public signUpLoaderShow = false;

  public actionBtnShow = true;

  public samePasswords = false;

  public emptyEthCheck = false;

  public TermsCheck = false;

  public resendEmail = false;

  public signupForm = true;

  public resendEmailLoader = false;

  public referralCode: any;

  public config: ToasterConfig = new ToasterConfig({ animation: 'flyRight' });

  public documentUrl;
  public privacyPolicy;
  public lang;
  isShow = false;
  isConfirm = false;
  countriesList: Array<Object> = file['list']['countries'];
  countryCode: string;
  countryName: string;
  patt1 = /[0-9]/g;
  patt2 = /[a-zA-Z]/g;
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

  public ngOnInit() {
    console.log(this.countriesList);
    this.userObject = JSON.parse(localStorage.getItem('userObject'));

    if (localStorage.getItem('userToken')) {
      this.router.navigate(['/home/dashboard']);
    }

    this.documentUrl = `${environment.documentUrl}`;
    this.privacyPolicy = `${environment.privacyPolicy}`;
    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.SignUpObject = new UserSignupModel();
      this.SignUpObject.referralCode = params.params['ref'];
    });

    this._sharedService.updateLanguage$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((res) => {
        this.lang = localStorage.getItem('language');
        if (this.lang) {
          this.translate.use(this.lang);
        } else {
          this.translate.use('en');
        }
      });

    this.lang = localStorage.getItem('language');
    if (this.lang) {
      this.translate.use(this.lang);
    } else {
      this.lang = 'en';
      this.translate.use('en');
    }
  }

  submitCaptcha(captchaResponse: string) {
    this.captchaKey = captchaResponse;

    if (this.captchaKey == null || this.captchaKey == undefined) {
    } else {
      this.actualSignUp();
    }
  }

  oncountrychange(e) {
    console.log(e);

    console.log(e.target.value);
    const value = e.target.value;
    const code = value.match(this.patt1).join('');
    console.log(code);
    const country = value.match(this.patt2).join('');
    console.log(country);

    this.countryCode = `+${code}`;
    this.countryName = country;
  }

  resendVerificationCode() {
    this.resendEmailLoader = true;
    this.actionBtnShow = false;
    this._userService.resendEmailToUser(this.SignUpObject.email).subscribe(
      (a) => {
        if (a.code == 200) {
          this.resendEmailLoader = false;
          this.actionBtnShow = true;
          this.lang == 'en'
            ? this.toasterService.pop('success', 'Success', a.message)
            : this.toasterService.pop(
              'success',
              'Satisfactorioamente',
              a.message
            );
          // this.toasterService.pop('success', 'Satisfactorioamente', a.message);
        }
      },
      (err) => {
        const obj = JSON.parse(err._body);

        this.toasterService.pop('error', 'Error', obj.message);

        this.resendEmailLoader = false;
        this.actionBtnShow = true;
      }
    );
  }

  actualSignUp() {
    this.signUpLoaderShow = true;

    this.actionBtnShow = false;

    this._userService.signUp(this.SignUpObject, this.captchaKey).subscribe(
      (a) => {
        if (a.code == 200) {
          this.signUpLoaderShow = false;

          this.actionBtnShow = true;

          this.lang == 'en'
            ? this.toasterService.pop('success', 'Success', a.message)
            : this.toasterService.pop(
              'success',
              'Satisfactorioamente',
              a.message
            );
          // this.toasterService.pop('success', 'Satisfactorioamente', a.message);

          $('#TermsCheck').prop('checked', false);

          grecaptcha.reset();

          setTimeout(() => {
            this.signupForm = false;
            this.resendEmail = true;
          }, 1500);
        }
      },
      (err) => {
        const obj = JSON.parse(err._body);
        this.toasterService.pop('error', 'Error', obj.message);

        this.signUpLoaderShow = false;
        this.actionBtnShow = true;
        this.captchaKey = null;
        grecaptcha.reset();
      }
    );
  }

  routeToLogin() {
    this.router.navigate(['/']);
  }

  signUpWithEnter(event) {
    if (event.keyCode == 13) {
      this.signUp();
    }
  }

  resetErrors() {
    this.validEmailCheck = false;
    this.emptyEmailCheck = false;
    this.emptyfullName = false;
    /*  this.ethCheck = false; */
    this.validPasswordCheck = false;
    this.validCPasswordCheck = false;
    this.samePasswords = false;
    this.TermsCheck = false;
    this.emptyEthCheck = false;
  }

  blockSpecialChar(event) {
    return this.ValidationsClass.blockSpecialChar(event);
  }

  signUp() {
    // if(this.SignUpObject.mobile){
    //   this.SignUpObject.mobile = `${this.SignUpObject.mobile}`
    // }
    let error = false;

    this.toasterService.clear();

    if (!this.ValidationsClass.verifyNameInputs(this.SignUpObject.email)) {
      error = true;
      this.lang == 'en'
        ? this.toasterService.pop('error', 'Error', 'Email is required')
        : this.toasterService.pop(
          'error',
          'Error',
          'Correo electrónico requerido'
        );
    } else {
      if (!this.ValidationsClass.validateEmail(this.SignUpObject.email)) {
        error = true;
        this.lang == 'en'
          ? this.toasterService.pop(
            'error',
            'Error',
            'Email should be a valid email.'
          )
          : this.toasterService.pop(
            'error',
            'Error',
            'Ingrese un correo electrónico válido'
          );
      }
    }

    if (!this.ValidationsClass.verifyNameInputs(this.SignUpObject.username)) {
      error = true;
      this.lang == 'en'
        ? this.toasterService.pop('error', 'Error', 'Please enter a username')
        : this.toasterService.pop(
          'error',
          'Error',
          'Favor de ingresar un usuario valido'
        );
    } else if (
      !this.ValidationsClass.verifyUserNameLength(this.SignUpObject.username)
    ) {
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
      if (!this.ValidationsClass.verifyUsername(this.SignUpObject.username)) {
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

    if (!this.ValidationsClass.verifyNameInputs(this.SignUpObject.fullName)) {
      error = true;
      this.lang == 'en'
        ? this.toasterService.pop('error', 'Error', 'Full Name is required')
        : this.toasterService.pop(
          'error',
          'Error',
          'Se requiere nombre completo '
        );
    }
    //TODO commented as country is now not going to be used if (!this.ValidationsClass.verifyNameInputs(this.SignUpObject.country)) {
    //   error = true;
    //   this.toasterService.pop('error', 'Error', 'Country is required');
    // }
    if (
      !this.ValidationsClass.validatePhone(
        `${this.countryCode}${this.SignUpObject.mobile}`
      )
    ) {
      error = true;
      this.toasterService.pop('error', 'Error', 'Invalid mobile number');
    }

    if (
      !this.ValidationsClass.verifyUserNameLength(this.SignUpObject.fullName)
    ) {
      error = true;
      this.lang == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          'Full Name should be between 3-50 characters'
        )
        : this.toasterService.pop(
          'error',
          'Error',
          'Nombre Completo (8-50 caracteres)'
        );
    }

    if (!this.ValidationsClass.verifyNameInputs(this.SignUpObject.password)) {
      error = true;
      this.lang == 'en'
        ? this.toasterService.pop('error', 'Error', 'Password is required')
        : this.toasterService.pop(
          'error',
          'Error',
          'La contraseña es requerida'
        );
    }

    if (
      this.SignUpObject.password &&
      !this.ValidationsClass.verifyPasswordLength(this.SignUpObject.password)
    ) {
      error = true;
      this.lang == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          `Password length must be between 8 to 50 characters including one small alphabet,
         one capital alphabet, one special character and one numeric value.`
        )
        : this.toasterService.pop(
          'error',
          'Error',
          `La contraseña debe tener entre 8 y 50 caracteres incluyendo una minúscula, una mayúscula, un número y un carácter especial`
        );
    }

    if (!this.ValidationsClass.verifyNameInputs(this.SignUpObject.cPassword)) {
      error = true;
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
    }

    if (this.SignUpObject.cPassword != this.SignUpObject.password) {
      error = true;
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
    }

    if ($('#TermsCheck').is(':checked')) {
    } else {
      error = true;
      this.lang == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          'Please accept terms and condition by clicking on check box terms & condition checkbox'
        )
        : this.toasterService.pop(
          'error',
          'Error',
          'Favor de aceptar los términos y condiciones dando clic en la casilla'
        );
    }

    if (error) {
      console.log(error);
    } else {
      if (this.SignUpObject.mobile) {
        this.SignUpObject.mobile = `${this.countryCode}${this.SignUpObject.mobile}`;
      }

      this.reCaptcha.execute();
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
