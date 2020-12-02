import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validations } from '../../validations';
import { UserService } from '../../services/userService';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/services/shared';
import { takeWhile } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'crypto-sign-in',
  providers: [UserService],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {

  public isAlive = true;
  
  public localState: any;
  public showContentWhenReady: boolean = false;
  public selectedProduct: any;
  public commentOnProduct: string;
  public emptyCommentError: boolean = false;

  public email: any;
  public password: any;
  public ValidationsClass: Validations;
  public emptyEmailCheck: boolean = false;
  public validEmailCheck: boolean = false;
  public validPasswordCheck: boolean = false;
  public loginLoaderShow: boolean = false;
  public actionBtnShow: boolean = true;
  public captchaKey = null;

  public lang;
  public selectedLanguage: string = 'default';
  @ViewChild(RecaptchaComponent) reCaptcha: RecaptchaComponent;

  public config: ToasterConfig =
    new ToasterConfig({ animation: 'flyRight' });

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


  public ngOnInit() {

    if(localStorage.getItem('userToken')){
      this.router.navigate(['/home/dashboard'])
    }

    this._sharedService.updateLanguage$
    .pipe(takeWhile(() => this.isAlive))
    .subscribe(res => {
      this.lang = localStorage.getItem('language');
      if(this.lang) {
        this.translate.use(this.lang)
      }else {
        this.translate.use('es')
      }
    })

    this.lang = localStorage.getItem('language');
      if(this.lang) {
        this.translate.use(this.lang)
      }else {
        this.translate.use('es')
      }
  }

  public languageChanged(value){
    localStorage.setItem('language', value);
    if(value){
      this.translate.use(value)
    }else{
      this.translate.use('es')
    }
  }

  add() {
    var myCustomMessage = "Not Ok";
  }



  submitCaptcha(captchaResponse: string) {

    this.captchaKey = captchaResponse;


    if (this.captchaKey == null || this.captchaKey == undefined) {

    } else {

      this.actualSignIn();

    }

  }



  actualSignIn() {
    this.loginLoaderShow = true;
    this.actionBtnShow = false;

    this._userService.signIn(this.email, this.password, this.captchaKey).subscribe(a => {

      if (a.code == 200) {

        localStorage.setItem('userObject', JSON.stringify(a.data));
        localStorage.setItem('userToken', JSON.stringify(a.data.token));
        let dd = document.getElementById('mainLangDD');
        if(dd){
          dd.style.display = 'none'
        }
        if(a.data.Language){
          this.translate.use(a.data.Language)
        }else{
          this.translate.use('es')
        }
        
        if (a.data.twoFAStatus) {
          this.router.navigate(['/authenticate']);
        } else {
          this.router.navigate(['/home/dashboard']);
        }


        this.loginLoaderShow = false;
        this.actionBtnShow = true;
        grecaptcha.reset();


      } else {

        this.toasterService.pop('error', 'Error', a.message);
        this.loginLoaderShow = false;
        this.actionBtnShow = true;
        grecaptcha.reset();
      }



    }, err => {

      var obj = JSON.parse(err._body)

      this.toasterService.pop('error', 'Error', obj.message);
      this.loginLoaderShow = false;
      this.actionBtnShow = true;
      grecaptcha.reset();
    })
  }




  resetErrors() {
    this.emptyCommentError = false;
    this.validEmailCheck = false;
    this.validPasswordCheck = false;
    this.emptyEmailCheck = false;
  }

  loginWithEnter(event) {
    if (event.keyCode == 13) {
      this.login();
    }
  }


  navigateToforgot() {
    this.router.navigateByUrl('/forgot-password');
  }




  login() {





    this.toasterService.clear();
    var error = false;


   

    if (!this.ValidationsClass.verifyNameInputs(this.email)) {
      this.lang == 'en' ? 
      this.toasterService.pop('error', 'Error', "Email/Username Cannot Empty") :
      this.toasterService.pop('error', 'Error', "Correo electronico/Usuario no pueden estar vacios") ;
      error = true;
    }
    //  else {
    //   if (!this.ValidationsClass.validateEmail(this.email)) {
    //     this.toasterService.pop('error', 'Error', "Email should be a valid Email");
    //     error = true;
    //   }
    // }

    if (!this.ValidationsClass.verifyNameInputs(this.password)) {
      this.lang == 'en' ?
      this.toasterService.pop('error', 'Error', "Password Cannot Be Empty") :
      this.toasterService.pop('error', 'Error', "Contraseña no puede estar vacia.") ;
      error = true;
    }


    if (error) {

    } else {



      this.reCaptcha.execute();



    }


  }
  routeToSignUp() {
    this.router.navigate(['sign-up']);
  }

  ngOnDestroy() {
    this.isAlive = false;
  }
}
