import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ShowToast } from '../../showtoast';
import { Validations } from '../../validations';
import { UserService } from '../../services/userService';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'src/app/services/shared';
import { takeWhile } from 'rxjs/operators';



declare var $: any;
@Component({

  selector: 'new-user-verify',
  providers: [UserService],
  styleUrls: ['./new-user-verify.component.scss'/*  './demo.css', './normalize.css', 'revealer.css', './pater.css' */],
  templateUrl: './new-user-verify.component.html',
})
export class NewUserVerify implements OnInit, OnDestroy {

  public isAlive = true;
  public localState: any;

  public showToast: ShowToast

  public email: string;

  public emptyEmailCheck: boolean = false;

  public validEmailCheck: boolean = false;

  public ValidationsClass: Validations;

  public noError: boolean = false;

  public errorOccurred: boolean = false;

  public resendCode: boolean = false;

  public  nine99Error:boolean = false;

  public errorInVerify: boolean = false;

  public errorVerify: boolean = false;

  public msgRecived: any;

  public tokenRecieved: any;

  public resendVerification: boolean = false;

  public resendLoader: boolean = false;

  public actionBtnShow: boolean = true;

  constructor(public route: ActivatedRoute, public router: Router, public _userService: UserService, private activatedRoute: ActivatedRoute,private translate: TranslateService, private _sharedService: SharedService) {

    this.ValidationsClass = new Validations();

    this.showToast = new ShowToast();

  }


  resendVerificationCode() {

    this.actionBtnShow = false;
    this.resendLoader = true;

    this._userService.resendEmailForAdminSignedUpUser(this.email).subscribe(a => {

      if (a.code == 200) {
        this.errorOccurred = false;
        this.noError = false;
        this.resendCode = true;
        this.actionBtnShow = true;
        this.resendLoader = false;
        this.resendVerification = false;
      }
    }, err => {

      this.noError = false;
      this.resendCode = false;
      var obj = JSON.parse(err._body);
      this.errorInVerify = true;
      this.errorVerify = obj.message;
      this.errorOccurred = true;
      this.actionBtnShow = true;
      this.resendLoader = false;

    })
  }





  public ngOnInit() {




    this.activatedRoute.queryParams.subscribe((params: Params) => {

      this.tokenRecieved = params['token'];
      this.msgRecived = params['msg'];




      if (this.msgRecived == undefined || this.msgRecived == null) {



      } else {


        if (this.msgRecived == "555") {

          this.nine99Error = false;
          this.errorOccurred = true;
          this.resendVerification = false;

          
          setTimeout(() => {
              this.router.navigate(['/']);
          }, 15000);

        }


        if (this.msgRecived == "999") {

          this.nine99Error = true;

          this.errorOccurred = false;

          this.resendVerification = false;

          setTimeout(() => {
              this.router.navigate(['/']);
          }, 15000);

        }


        if (this.msgRecived == "000") {
          
          this.nine99Error = false;
          this.errorOccurred = false;
          this.resendVerification = true;

          this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.email = params['email'];
          
          });


        }



      }

    });

    this._sharedService.updateLanguage$
    .pipe(takeWhile(() => this.isAlive))
    .subscribe(res => {
      let lang = localStorage.getItem('language');
      if(lang) {
        this.translate.use(lang)
      }else {
        this.translate.use('es')
      }
    })

    let lang = localStorage.getItem('language');
      if(lang) {
        this.translate.use(lang)
      }else {
        this.translate.use('es')
      }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.isAlive = false;
  }
}
