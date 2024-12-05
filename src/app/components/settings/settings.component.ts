import {
  Component,
  OnInit,
  NgZone,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { Validations } from '../../validations';
import { UserSignupModel } from '../../models/userSignup.Model';
import { UserService } from '../../services/userService';
import { SharedService } from '../../services/shared';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { getLanguage } from '../../services/utils';

import * as $ from 'jquery';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { takeWhile } from 'rxjs/operators';

declare var $: any;
@Component({
  selector: 'my-wallet',
  providers: [UserService, NgbDatepickerConfig],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ],
  styleUrls: ['./settings.component.scss'],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
  public isAlive = true;
  //file type
  public frontFileType;
  public backFileType;
  public billFileType;

  public dob: any;
  public qrcode: any = 'Dummy QR';
  public userObject: any;
  public oldPassword: any;
  public password: any;
  public cPassword: any;
  public validations: Validations;

  public countries = [];
  public nationalities = [];
  public countryCodes = [];
  public userCountry: any;
  public selectedCode: any;

  public userNationilityCountry: any;

  public country2Code: any;

  public userNationality: any;

  public updatePasswordBtn = true;

  public IframeBox = false;

  public kycBox = true;

  public changeGeneralBtn = true;
  public enable2faDiv = false;
  public loginLoaderShow = false;

  public twoFaLoader = false;
  public authenticateApiLoader = false;

  public ToTpUri: any;
  public TwoFAFormattedKey: any;
  public disable2FA = false;

  public config: ToasterConfig = new ToasterConfig({ animation: 'flyRight' });

  public twoFaCode: number;
  public authBtn = true;
  public disable2faLoader = false;
  public state: any = 'true';

  public kycLoader = false;

  public kycBtn = true;

  public disableSwitch = false;
  public pdfUploaded: any = '../../../assets/img/pdf.png';

  public pictureUploaded: any = '../../../assets/img/upload.png';

  public kycUrl: any = '';

  public userKycStatus: any;
  public AcutalStatus: any;
  public userWalletAddress: any;

  // Kyc section

  public defaultImage = this.pictureUploaded;
  public frontPhoto: any = this.defaultImage;
  public backPhoto: any = this.defaultImage;
  public billPhoto: any = this.defaultImage;

  public frontPhotoFile: any = null;
  public backPhotoFile: any = null;
  public billPhotoFile: any = null;
  public disabled = false;

  public billType: any = '';
  public img_type: any = undefined;
  public billTypeImage: any = undefined;
  public phoneNumber: any;
  public idType: any;
  public isShow = false;
  public isNew = false;
  public isConfirm = false;
  public showDetails = false;
  u;
  public userToken: string;
  public isProfileEdit: boolean = false;
  kycInfo;
  isExist: boolean;
  @ViewChild('currentpassword') currentpassword: ElementRef;
  @ViewChild('newpassword') newpassword: ElementRef;
  @ViewChild('confirmpassword') confirmpassword: ElementRef;

  constructor(
    config: NgbDatepickerConfig,
    public router: Router,
    public _userService: UserService,
    public _sharedService: SharedService,
    private toasterService: ToasterService,
    private http: Http,
    private ngZone: NgZone
  ) {
    this.validations = new Validations();
    this.toasterService = toasterService;
    // customize default values of datepickers used by this component tree
    config.minDate = { year: 1930, month: 1, day: 1 };
    config.maxDate = { year: 2000, month: 12, day: 31 };

    // days that don't belong to current month are not visible
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    this.pdfUploaded = '../../../assets/img/pdf.png';
    this.userObject = JSON.parse(localStorage.getItem('userObject'));

    $('.list-unstyled li').removeClass('active');
    $('#settings-small').addClass('active');

    this._sharedService.showHideLoader(true);

    this.userObject = JSON.parse(localStorage.getItem('userObject'));
    this.userToken = JSON.parse(localStorage.getItem('userToken'));
    console.log(this.userToken);
    this.getUserInfo();
    this.retrieveKycInfo();
    this._sharedService.updateAppLang$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((res) => {
        this.userObject = JSON.parse(localStorage.getItem('userObject'));
      });

    this.userWalletAddress = this.userObject.WalletAddress;
    this.getAllCountries();

    // if (this.userObject == null || this.userObject == undefined) {

    // } else {

    //   if (this.userObject.KycUrl == undefined || this.userObject.KycUrl == null) {
    //     /*     this.kycBox = true;
    //         this.IframeBox = false; */
    //   } else {
    //     /*    this.kycBox = false; */
    //     this.kycUrl = this.userObject.KycUrl;
    //     /*      this.IframeBox = true; */
    //   }
    // }

    if (this.userObject.twoFAStatus) {
      this.disable2FA = true;
      this.disableSwitch = true;
    } else {
      this.disable2FA = false;
    }

    // this.getCountriesCode()
    // .subscribe((data) => {
    //   this.countryCodes = data;
    // },(error) => {
    //   console.log("Unable to load some data" + error)
    // });

    this.getkycstatus();
  }

  //Methods to get countries
  public getCountriesCode() {
    return this.http
      .get('/assets/custom/country-code.json')
      .map((res: any) => res.json())
      .catch((res) => res);
  }

  getUserInfo() {
    this._userService
      .userDetails(this.userObject.Email, this.userToken)
      .subscribe(
        (res) => {
          console.log(res);
          this.userObject.memberType = res['data']['membership_type'];
          if (!this.userObject.memberType) {
            this.userObject.memberType = 'N/A';
          }
          this.userObject.licenseCode = res['data']['licence_code'];

          if (!this.userObject.licenseCode) {
            this.userObject.licenseCode = 'N/A';
          }
          this.userObject.licenseNo = res['data']['licence_number'];

          if (!this.userObject.licenseNo) {
            this.userObject.licenseNo = 'N/A';
          }
        },
        (err) => {
          const obj = JSON.parse(err._body);

          console.log(obj);
        }
      );
  }

  retrieveKycInfo() {
    this._userService
      .kycDetails(this.userObject.Email, this.userToken)
      .subscribe(
        (res) => {
          if (res) {
            this.isExist = true;
            console.log(res);
            this.kycInfo = res['data'];
          }
        },
        (err) => {
          const obj = JSON.parse(err._body);
          console.log(obj);
          this.isExist = false;
        }
      );
  }

  getkycstatus() {
    this._userService.getKycStatus(this.userObject.UserId).subscribe(
      (a) => {
        this._sharedService.showHideLoader(false);
        if (a.code == 200) {
          this.userKycStatus = a.data.status;
          this.userObject.IsKycVerified = a.data.status;
          localStorage.setItem('userObject', JSON.stringify(this.userObject));
          if (this.userKycStatus == 'NOT_SUBMITTED') {
            this.AcutalStatus = 'Not Submitted';
            this.kycBox = true;
          } else if (this.userKycStatus == 'SUBMITTED') {
            this.AcutalStatus = 'submitted';
            this.showKycDetails(this.userObject, a.data);
          } else if (this.userKycStatus == 'ACCEPTED') {
            this.AcutalStatus = 'Accepted';
            this.showKycDetails(this.userObject, a.data);
          } else {
            this.AcutalStatus = 'Rejected';
          }
        }
      },
      (err) => {
        this._sharedService.showHideLoader(false);
      }
    );
  }

  getIDType(event) {
    this.idType = event;
    this.img_type = this.idType;
  }

  getBillType(event) {
    this.billType = event;
    this.billTypeImage = this.billType;
  }

  getSelectedNationality(event) {
    this.userNationality = event;
    const obj = this.countries.find((x) => x.alpha2Code == event);
    this.userNationilityCountry = obj.name;
  }

  getSelectedCountry(event) {
    this.userCountry = event;
    const obj = this.countries.find((x) => x.name == event);
    this.country2Code = obj.alpha2Code;
  }

  getAllCountries() {
    this._userService.getCountries().subscribe((a) => {
      this.countries = a;
      this.nationalities = a;
    });
  }

  submitKyc() {
    let error = false;

    this.toasterService.clear();

    const IDTYPE = this.idType == 'INE' ? 'INE' : 'PASAPORTE';
    if (
      this.idType === 'INE' &&
      (!this.frontPhotoFile || !this.backPhotoFile)
    ) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          `Please Upload ${this.idType} Front & ${this.idType} Back Image`
        )
        : this.toasterService.pop(
          'error',
          'Error',
          `Favor de subir ${IDTYPE} frente y ${IDTYPE} Posterior imagen`
        );
      error = true;
    } else if (this.idType === 'PASSPORT' && !this.frontPhotoFile) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          `Please Upload ${this.idType} Front Image`
        )
        : this.toasterService.pop(
          'error',
          'Error',
          `Favor de subir ${IDTYPE} frente imagen`
        );
      error = true;
    } else if (!this.idType) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop('error', 'Error', 'Please Select ID Type')
        : this.toasterService.pop(
          'error',
          'Error',
          'Por favor elige el tipo de Identificacion'
        );
      error = true;
    }

    const BILLTYPE = this.billType == 'PHONE' ? 'Teléfono' : 'Electricidad';
    if (
      (this.billType === 'PHONE' || this.billType === 'ELECTRICITY') &&
      !this.billPhotoFile
    ) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          `Please Upload ${this.billType} Bill Image`
        )
        : this.toasterService.pop(
          'error',
          'Error',
          `Favor de Subir el Comprobante de Domicilio`
        );
      error = true;
    } else if (!this.billType) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop('error', 'Error', 'Please Select Bill Type')
        : this.toasterService.pop(
          'error',
          'Error',
          'Por favor elige el comprobante de domicilio'
        );
      error = true;
    }

    if (this.phoneNumber == undefined) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          'Phone Number Cannot Be Empty'
        )
        : this.toasterService.pop(
          'error',
          'Error',
          'Numero de telefono no puede estar vacio'
        );
      error = true;
    }

    if (this.selectedCode == undefined) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop('error', 'Error', 'Code Cannot Be Empty')
        : this.toasterService.pop(
          'error',
          'Error',
          'Codigo de Pais no puede estar vacio'
        );
      error = true;
    }

    if (
      (this.selectedCode && this.selectedCode.length < 2) ||
      this.selectedCode.length > 4
    ) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          'Code Must Be Between 2 to 4 Digits'
        )
        : this.toasterService.pop(
          'error',
          'Error',
          'El codigo del pais debe tener entre 2 y 4 digitos'
        );
      error = true;
    }

    if (
      (this.phoneNumber && this.phoneNumber.length < 7) ||
      this.phoneNumber.length > 10
    ) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          'Phone Must Be Between 7 to 10 Digits'
        )
        : this.toasterService.pop(
          'error',
          'Error',
          'El número telefónico debe ser de 7 y 10 dígitos'
        );
      error = true;
    }

    if (error) {
    } else {
      this.kycLoader = true;
      this.kycBtn = false;

      this._userService
        .doKyc(
          this.userObject.UserId,
          this.idType,
          this.frontPhotoFile,
          this.backPhotoFile,
          this.billType,
          this.billPhotoFile,
          this.phoneNumber,
          this.userObject.Name,
          this.selectedCode
        )
        .subscribe(
          (a) => {
            if (a.code == 200) {
              this.kycBtn = true;
              this.userObject.Language == 'en'
                ? this.toasterService.pop('success', 'Success', a.message)
                : this.toasterService.pop(
                  'success',
                  'Satisfactorioamente',
                  a.message
                );
              this.kycLoader = false;
              this.showDetails = true;
              this.userKycStatus = 'SUBMITTED';
              this.AcutalStatus = 'SUBMITTED';
              this.userObject.IsKycVerified = this.userKycStatus;
              localStorage.setItem(
                'userObject',
                JSON.stringify(this.userObject)
              );
              // disable properties
              $('#phoneNumber').prop('disabled', true);
              this.disabled = true;
              setTimeout(() => { }, 3000);
            }
          },
          (err) => {
            const obj = JSON.parse(err._body);
            this.toasterService.pop('error', 'Error', obj.message);
            this.kycLoader = false;
            this.kycBtn = true;
            if (obj.code == 401) {
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        );
    }
  }

  checkLength() {
    const fieldLength = $('#twoFaCode').val().length;

    if (fieldLength <= 6) {
      return true;
    } else {
      let str = $('#twoFaCode').val();
      str = str.substring(0, str.length - 1);
      $('#twoFaCode').val(str);
      this.twoFaCode = str;
    }
  }

  openDialogForPicUpload() {
    $('#imageUploader').click();
  }

  // readURL(input) {

  //   var reader: any,
  //     target: EventTarget;
  //   reader = new FileReader();

  //   input = document.getElementById('imgInp');
  //   if (input.files && input.files[0]) {
  //     // var reader = new FileReader();
  //     var self = this;

  //     if (input.files[0].type.indexOf("image") == -1) {
  //       self.toasterService.pop('error', 'Error', "File type not allowed");
  //       return false;
  //     }

  //     reader.onload = function (e) {

  //       if (input.files[0].size > 528385) {
  //         self.toasterService.pop('error', 'Error', "File is too large, please upload less than 5kb");
  //         return false;
  //       }

  //       $('#blah').attr('src', e.target.result);
  //       self.pictureUploaded = input.files[0];

  //     }

  //     reader.readAsDataURL(input.files[0]);
  //   }
  // }

  disableOnEnter(event) {
    if (event.keyCode == 13) {
      this.disable2FAFunction();
    }
  }

  disable2FAFunction() {
    this.state = 'false';
    let error = false;
    this.toasterService.clear();

    if (!this.validations.verifyNameInputs(this.twoFaCode)) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop('error', 'Error', 'Please enter a 2FA Code')
        : this.toasterService.pop(
          'error',
          'Error',
          'Favor de introducir el codigo 2FA'
        );
      error = true;
    }

    if (error) {
    } else {
      this.disable2faLoader = true;
      this.authBtn = false;

      this._userService
        .authenticate2Fa(
          this.userObject.Email,
          'false',
          this.twoFaCode,
          this.userObject.TwoFAFormattedKey,
          this.userObject.ToTpUri,
          this.userObject.UserId
        )
        .subscribe(
          (a) => {
            if (a.code == 200) {
              this.disableSwitch = false;

              this.userObject.twoFAStatus = false;
              this.twoFaCode = undefined;
              localStorage.setItem(
                'userObject',
                JSON.stringify(this.userObject)
              );
              this.disable2faLoader = false;
              this.authBtn = true;
              this.userObject.Language == 'en'
                ? this.toasterService.pop('success', 'Success', a.message)
                : this.toasterService.pop(
                  'success',
                  'Satisfactorioamente',
                  a.message
                );
              this.enable2faDiv = false;
              this.disable2FA = false;
              this.state = true;
            }
          },
          (err) => {
            const obj = JSON.parse(err._body);
            this.toasterService.pop('error', 'Error', obj.message);
            this.disable2faLoader = false;
            this.authBtn = true;

            if (obj.code == 401) {
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        );
    }
  }

  authenticateOnEnter(event) {
    if (event.keyCode == 13) {
      this.authenticate2Fa();
    }
  }

  authenticate2Fa() {
    let error = false;
    this.toasterService.clear();

    if (!this.validations.verifyNameInputs(this.twoFaCode)) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop('error', 'Error', 'Please enter a 2FA Code')
        : this.toasterService.pop(
          'error',
          'Error',
          'Favor de introducir el codigo 2FA'
        );
      error = true;
    }

    if (error) {
    } else {
      this.authenticateApiLoader = true;
      this.authBtn = false;

      this._userService
        .authenticate2Fa(
          this.userObject.Email,
          'true',
          this.twoFaCode,
          this.TwoFAFormattedKey,
          this.ToTpUri,
          this.userObject.UserId
        )
        .subscribe(
          (a) => {
            if (a.code == 200) {
              this.twoFaCode = undefined;
              this.userObject.twoFAStatus = true;
              localStorage.setItem(
                'userObject',
                JSON.stringify(this.userObject)
              );
              this.authenticateApiLoader = false;
              this.authBtn = true;
              this.userObject.Language == 'en'
                ? this.toasterService.pop('success', 'Success', a.message)
                : this.toasterService.pop(
                  'success',
                  'Satisfactorioamente',
                  a.message
                );
              this.disable2FA = true;
              this.disableSwitch = true;
              this.enable2faDiv = false;
            }
          },
          (err) => {
            const obj = JSON.parse(err._body);
            this.toasterService.pop('error', 'Error', obj.message);
            this.authenticateApiLoader = false;
            this.authBtn = true;

            if (obj.code == 401) {
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        );
    }
  }

  isNumberKey(evt, code) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (
      charCode != 45 &&
      charCode != 43 &&
      charCode > 31 &&
      (charCode < 48 || charCode > 57)
    ) {
      return false;
    }

    if (code && this.selectedCode && this.selectedCode.length == 4) {
      return false;
    } else if (!code && this.phoneNumber && this.phoneNumber.length == 10) {
      return false;
    } else {
      return true;
    }
  }

  isNumberKeyTwoFA(evt, code) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (
      charCode != 45 &&
      charCode != 43 &&
      charCode > 31 &&
      (charCode < 48 || charCode > 57)
    ) {
      return false;
    }
    return true;
  }
  enableDisable2FA(event) {
    this.disableSwitch = true;

    this.twoFaLoader = true;

    if (event) {
      this._userService
        .enableDisable2FA(this.userObject.Email, this.userObject.UserId)
        .subscribe(
          (a) => {
            if (a.code == 200) {
              this.twoFaLoader = false;
              const url =
                'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=200x200&chld=M%7C0&cht=qr&chl=';

              this.ToTpUri = url + a.data.toTpUri;
              this.TwoFAFormattedKey = a.data.twoFaKey;

              this.enable2faDiv = true;
              this.disableSwitch = false;
            }
          },
          (err) => {
            const obj = JSON.parse(err._body);
            this.toasterService.pop('error', 'Error', obj.message);
            this.twoFaLoader = false;

            if (obj.code == 401) {
              localStorage.clear();
              this.router.navigate(['/']);
            }

            this.disableSwitch = false;
          }
        );
    } else {
      this.twoFaLoader = false;
      this.enable2faDiv = false;
      this.disableSwitch = false;
    }
  }

  updateGeneralSettings() {
    let error = false;
    this.toasterService.clear();

    if (!this.validations.verifyNameInputs(this.userObject.Name)) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop('error', 'Error', "Name Can't be Empty.")
        : this.toasterService.pop(
          'error',
          'Error',
          'nombre no pueden estar vacios'
        );
      error = true;
    } else if (!this.validations.verifyUserNameLength(this.userObject.Name)) {
      error = true;
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          'Name should be between 3-50 characters'
        )
        : this.toasterService.pop(
          'error',
          'Error',
          'El nombre completo debe ser entre 3 y 50 caracteres'
        );
    }

    if (this.userWalletAddress == undefined) {
    } else {
      this.userWalletAddress = this.userWalletAddress.trim();
    }

    if (this.userObject.hasOwnProperty('WalletAddress')) {
      if (this.userObject.WalletAddress == '' && this.userWalletAddress == '') {
        this.userObject.Language == 'en'
          ? this.toasterService.pop(
            'error',
            'Error',
            "ETH address can't be empty."
          )
          : this.toasterService.pop(
            'error',
            'Error',
            'La Dirección ETH no puede estar vacía'
          );
        error = true;
      } else if (
        this.userObject.WalletAddress != '' &&
        this.userWalletAddress == ''
      ) {
        this.userObject.Language == 'en'
          ? this.toasterService.pop(
            'error',
            'Error',
            "ETH address can't be empty."
          )
          : this.toasterService.pop(
            'error',
            'Error',
            'La Dirección ETH no puede estar vacía'
          );
        error = true;
      }
    } else {
    }

    if (error) {
    } else {
      this._sharedService.showHideLoader(true);
      this.changeGeneralBtn = false;

      this._userService
        .changeGeneralSettings(
          this.userObject.UserId,
          this.userObject.Name,
          this.userWalletAddress
        )
        .subscribe(
          (a) => {
            if (a.code == 200) {
              this._sharedService.showHideLoader(false);
              this.updatePasswordBtn = true;
              this.userObject.Language == 'en'
                ? this.toasterService.pop('success', 'Success', a.message)
                : this.toasterService.pop(
                  'success',
                  'Satisfactorioamente',
                  a.message
                );
              this.changeGeneralBtn = true;
              this.userObject.WalletAddress = this.userWalletAddress;
              localStorage.setItem(
                'userObject',
                JSON.stringify(this.userObject)
              );
              this._sharedService.changeUserObject(
                JSON.parse(localStorage.getItem('userObject'))
              );
            }
          },
          (err) => {
            this._sharedService.showHideLoader(false);
            const obj = JSON.parse(err._body);
            this.toasterService.pop('error', 'Error', obj.message);
            this.changeGeneralBtn = true;
            this.userObject = null;
            this.userObject = JSON.parse(localStorage.getItem('userObject'));

            if (obj.code == 401) {
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        );
    }
  }

  refreshPasswords() {
    this.oldPassword = undefined;
    this.password = undefined;
    this.cPassword = undefined;
  }

  updatePassword() {
    this.toasterService.clear();

    let error = false;

    if (!this.validations.verifyNameInputs(this.oldPassword)) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          'Old Password Cannot be Empty'
        )
        : this.toasterService.pop(
          'error',
          'Error',
          'Contraseña anterior no puede estar vacio'
        );
      error = true;
    }

    if (!this.validations.verifyNameInputs(this.password)) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop('error', 'Error', 'Password Cannot be Empty')
        : this.toasterService.pop(
          'error',
          'Error',
          'Contraseña no puede estar vacia'
        );
      error = true;
    }

    if (
      this.password &&
      !this.validations.verifyPasswordLength(this.password)
    ) {
      error = true;
      this.userObject.Language == 'en'
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

    if (!this.validations.verifyNameInputs(this.cPassword)) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          'Password and confirm password must match'
        )
        : this.toasterService.pop(
          'error',
          'Error',
          'Ambas contraseñas deben coincidir'
        );
      error = true;
    }

    if (this.cPassword != this.password) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
          'error',
          'Error',
          'Password and confirm password must match'
        )
        : this.toasterService.pop(
          'error',
          'Error',
          'Ambas contraseñas deben coincidir'
        );
      error = true;
    }

    if (error) {
    } else {
      this._sharedService.showHideLoader(true);
      this.updatePasswordBtn = false;
      this._userService
        .changePassword(this.oldPassword, this.password, this.userObject.UserId)
        .subscribe(
          (a) => {
            if (a.code == 200) {
              this._sharedService.showHideLoader(false);
              this.updatePasswordBtn = true;
              this.userObject.Language == 'en'
                ? this.toasterService.pop('success', 'Success', a.message)
                : this.toasterService.pop(
                  'success',
                  'Satisfactorioamente',
                  a.message
                );
              this.refreshPasswords();
            }
          },
          (err) => {
            this._sharedService.showHideLoader(false);
            const obj = JSON.parse(err._body);
            this.toasterService.pop('error', 'Error', obj.message);
            this.updatePasswordBtn = true;

            if (obj.code == 401) {
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        );
    }
  }
  copyToClipboard(id) {
    /* Get the text field */
    const copyText = document.getElementById(id) as HTMLInputElement;

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand('Copy');
  }

  // image chooser
  openfrontFileChooser() {
    if (!this.disabled) {
      $('#idFront').click();
    }
  }
  openBackFileChooser() {
    if (!this.disabled) {
      $('#idBack').click();
    }
  }
  openBillFileChoose() {
    if (!this.disabled) {
      $('#idBill').click();
    }
  }

  // Image uploader
  // image change ID
  frontImage(event) {
    this.readURL(event, 'front');
  }

  // image change ID
  backImage(event) {
    this.readURL(event, 'back');
  }

  // image change ID
  billImageEvent(event) {
    this.readURL(event, 'bill');
  }

  // Image stream reader
  readURL(input, type) {
    let reader: any, target: EventTarget;
    reader = new FileReader();
    if (type == 'front') {
      input = document.getElementById('idFront');
    } else if (type == 'back') {
      input = document.getElementById('idBack');
    } else if (type == 'bill') {
      input = document.getElementById('idBill');
    }

    if (input.files && input.files[0]) {
      if (
        input.files[0].type == 'image/png' ||
        input.files[0].type == 'image/jpeg' ||
        input.files[0].type == 'application/pdf'
      ) {
        if (input.files[0].size < 5242880) {
          const self = this;
          reader.onload = function (e) {
            if (type == 'front') {
              self.frontFileType = input.files[0].type;
              self.frontPhoto =
                self.frontFileType === 'application/pdf'
                  ? self.pdfUploaded
                  : e.target.result;
              self.frontPhotoFile = input.files[0];
            } else if (type == 'back') {
              self.backFileType = input.files[0].type;
              self.backPhoto =
                self.backFileType === 'application/pdf'
                  ? self.pdfUploaded
                  : e.target.result;
              self.backPhotoFile = input.files[0];
            } else if (type == 'bill') {
              self.billFileType = input.files[0].type;
              self.billPhoto =
                self.billFileType === 'application/pdf'
                  ? self.pdfUploaded
                  : e.target.result;
              self.billPhotoFile = input.files[0];
            }
          };
          reader.readAsDataURL(input.files[0]);
        } else {
          if (type == 'front') {
            this.frontPhotoFile = null;
          } else if (type == 'back') {
            this.backPhotoFile = null;
          } else if (type == 'bill') {
            this.billPhotoFile = null;
          }
          this.toasterService.clear();
          this.userObject.Language == 'en'
            ? this.toasterService.pop(
              'error',
              'Error',
              'Max upload size is limited to 5 MB'
            )
            : this.toasterService.pop(
              'error',
              'Error',
              'El documento es muy pesado, favor de subir una imagen menor a 5mb'
            );
        }
      } else {
        this.toasterService.clear();
        this.userObject.Language == 'en'
          ? this.toasterService.pop(
            'error',
            'Error',
            'Only jpg, png, and pdf file supported'
          )
          : this.toasterService.pop(
            'error',
            'Error',
            'Solo archivos .jpg y .png '
          );
      }
    }
  }

  showKycDetails(user, kycDetails) {
    this.showDetails = true;

    if (kycDetails.idType == 'INE') {
      this.backPhoto = kycDetails.backImage;
      if (kycDetails.backImage) {
        const file = kycDetails.backImage.split('?');
        const tempEx = file[0].split('.');
        this.backFileType = tempEx[5];
        this.backPhoto =
          this.backFileType == 'pdf' ? this.pdfUploaded : kycDetails.backImage;
      }
    }
    if (kycDetails.frontImage) {
      const file = kycDetails.frontImage.split('?');
      const tempEx = file[0].split('.');

      this.frontFileType = tempEx[5];

      this.frontPhoto =
        this.frontFileType == 'pdf' ? this.pdfUploaded : kycDetails.frontImage;
    }
    if (kycDetails.billImage) {
      const file = kycDetails.billImage.split('?');
      const tempEx = file[0].split('.');

      this.billFileType = tempEx[5];
      this.billPhoto =
        this.billFileType == 'pdf' ? this.pdfUploaded : kycDetails.billImage;
    }

    //this.frontPhoto = kycDetails.frontImage
    //this.billPhoto = kycDetails.billImage
    // this.img_type = kycDetails.idType
    this.billTypeImage = kycDetails.billType;

    this.phoneNumber = kycDetails.phoneNumber;
    this.selectedCode = kycDetails.code;

    // disable properties
    $('#phoneNumber').prop('disabled', true);
    this.disabled = true;
  }

  ngOnDestroy() {
    this.isAlive = false;
  }

  hidePassword(value) {
    if (value == 'currentpassword') {
      this.currentpassword.nativeElement.setAttribute('type', 'password');
      this.isShow = false;
    } else if (value == 'newpassword') {
      this.newpassword.nativeElement.setAttribute('type', 'password');
      this.isNew = false;
    } else if (value == 'confirmpassword') {
      this.confirmpassword.nativeElement.setAttribute('type', 'password');
      this.isConfirm = false;
    }
  }
  showPassword(value) {
    if (value == 'currentpassword') {
      this.currentpassword.nativeElement.setAttribute('type', 'text');
      this.isShow = true;
    } else if (value == 'newpassword') {
      this.newpassword.nativeElement.setAttribute('type', 'text');
      this.isNew = true;
    } else if (value == 'confirmpassword') {
      this.confirmpassword.nativeElement.setAttribute('type', 'text');
      this.isConfirm = true;
    }
  }
  editProfileButton() {
    this.isProfileEdit = !this.isProfileEdit
    this.userObject = JSON.parse(localStorage.getItem('userObject'));
  }
  updateProfile() {
    let error = false;
    this.toasterService.clear();

    if (!this.validations.verifyNameInputs(this.userObject.Name)) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop('error', 'Error', "Name Can't be Empty.")
        : this.toasterService.pop(
          'error',
          'Error',
          'nombre no pueden estar vacios'
        );
      error = true;
    } else if (!this.validations.validatePhone(this.userObject.PhoneNumber)) {
      error = true;
      this.toasterService.pop('error', 'Error', 'Invalid mobile number');
    }
    if (error) {
    }
    else {
      this._userService
        .updateProfile(
          this.userObject.Name,
          this.userObject.PhoneNumber
        )
        .subscribe(
          (a) => {
            if (a.code == 200) {
              this._sharedService.showHideLoader(false);
              this.userObject.Language == 'en'
                ? this.toasterService.pop('success', 'Success', a.message)
                : this.toasterService.pop(
                  'success',
                  'Satisfactorioamente',
                  a.message
                );
              this.isProfileEdit = false
              localStorage.setItem(
                'userObject',
                JSON.stringify(this.userObject)
              );
              this._sharedService.changeUserObject(
                JSON.parse(localStorage.getItem('userObject'))
              );
            }
          },
          (err) => {
            this._sharedService.showHideLoader(false);
            const obj = JSON.parse(err._body);
            this.toasterService.pop('error', 'Error', obj.message);
            this.isProfileEdit = false
            this.userObject = null;
            this.userObject = JSON.parse(localStorage.getItem('userObject'));

            if (obj.code == 401) {
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        );
    }
  }
}
