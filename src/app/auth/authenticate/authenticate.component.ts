import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validations } from '../../validations';
import { UserService } from '../../services/userService';
import { RecaptchaComponent } from 'ng-recaptcha';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { PlatformLocation } from '@angular/common'
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/services/shared';
import { takeWhile } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'crypto-authenticate',
  providers: [UserService],
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent implements OnInit, OnDestroy {


  public isAlive = true;
  public twoFa: any;
  public ValidationsClass: Validations;
  public loginLoaderShow:boolean = false;
  public actionBtnShow:boolean = true;
  public email:any;
  public userObject:any;
  public lang;
  @ViewChild(RecaptchaComponent) reCaptcha: RecaptchaComponent;

  public config: ToasterConfig =
    new ToasterConfig({ animation: 'flyRight' });

  constructor(
    public route: ActivatedRoute, 
    public router: Router,
    public _userService: UserService, 
    private toasterService: ToasterService,
    private location: PlatformLocation,
    private translate: TranslateService,
    private _sharedService: SharedService
    ) {
    this.ValidationsClass = new Validations;
  }


  public ngOnInit() {
    this.userObject = JSON.parse(localStorage.getItem("userObject"));

    this.location.onPopState(() => {
      localStorage.clear();
    });

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

  authenticateWithEnter(event) {
    if (event.keyCode == 13) {
      this.authenticate2Fa();
    }
  }

  isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}


  navigateToforgot() {
    this.router.navigateByUrl('/forgot-password');
  }

  authenticate2Fa() {

    this.toasterService.clear();
    var error = false;

    if (!this.ValidationsClass.verifyNameInputs(this.twoFa)) {
      this.lang == 'en' ?
      this.toasterService.pop('error', 'Error', "Please enter your code") :
      this.toasterService.pop('error', 'Error', "Favor de ingresar su codigo de afiliación");
      error = true;
    }

    if(error){

    }else{

      this._userService.authenticate2FALogin(this.userObject.email,this.twoFa).subscribe(a=>{


        if(a.code == 200){

          this.loginLoaderShow = false;
          this.actionBtnShow = true;
          localStorage.setItem('userObject', JSON.stringify(a.data));
          localStorage.setItem('userToken', JSON.stringify(a.data.token));
          this.router.navigate(['/home/dashboard']);
          
        }

      }, err => {

        var obj = JSON.parse(err._body)
  
        this.toasterService.pop('error', 'Error', obj.message);
        this.loginLoaderShow = false;
        this.actionBtnShow = true;
        grecaptcha.reset();
      })
    }
  }



  routeToSignUp() {

    localStorage.clear()
    this.router.navigate(['/sign-up']);

  }

  ngOnDestroy() {
    this.isAlive = false
  }
}
