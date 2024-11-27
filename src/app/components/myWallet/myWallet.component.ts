import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { ShowToast } from '../../showtoast';
import { Validations } from '../../validations';
import { UserSignupModel } from '../../models/userSignup.Model';
import { WalletServices } from '../../services/walletServices';
import { SharedService } from '../../services/shared';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { UserService } from '../../services/userService';
import { AmountInvestedModel } from '../../models/amountInvestedModel';
import { DashboardService } from '../../services/dashboardService';
import { takeWhile } from 'rxjs/operators';

declare var $: any;
@Component({
  selector: 'my-wallet',
  providers: [WalletServices, UserService, DashboardService],
  styleUrls: ['./myWallet.component.scss'],
  templateUrl: './myWallet.component.html'
})
export class MyWalletComponent implements OnInit, OnDestroy {
  bankObj: object;
  userToken: string;
  userId;
  totalPiptles = 0;
  isTwoFa = true;
  bankdetails: string;
  isWalletAddress: boolean;
  public isAlive = true;
  public config: ToasterConfig = new ToasterConfig({ animation: 'flyRight' });
  public userObject: any;
  public onChangeEuroOrUsd: any;
  public showToast: any;
  public noEthAddress = false;
  public walletInfo: any;
  public ethAddress: any;
  public investedValues: AmountInvestedModel;
  public updateEth = true;
  public updateLoader = false;
  public _alive = true;
  public fileName: any;

  public wireCurrencySelected: any = 'AUD';

  public creditCardCurrency: any = 'USD';

  public currencyType: any;

  public validations: Validations;

  public submitClaimLoader = false;

  public submitClaimBtn = true;

  public bankInfo: any;

  public instrumentId: any;

  public bankName: any;

  public uploadedFile: any;

  public CreditCardType: any;

  public creditCardNumber: any;

  public creditCardCvc: any;

  public merchantBankName: any;
  public beneficiaryNomber: any;
  public swift: any;
  public beneficiartBank: any;
  public branchCode: any;
  public address: any;
  public merchantBankAccount: any;

  public currencyRate: any = 0.0;
  public currencyRateCreditCard: any = 0.0;

  public LoaderWire = false;

  public LoaderCC = false;

  public currencyTypeUserPaidIn: any;

  public count = 0;
  public RestrictionModalMessage = '';
  public displayField = false;
  // 2FA
  // private TwoFAEnabled = false;

  constructor(
    public _userSerivce: UserService,
    public router: Router,
    public _walletService: WalletServices,
    public _sharedService: SharedService,
    private toasterService: ToasterService,
    public _dashboardService: DashboardService,
    public _ngZone: NgZone
  ) {
    this.showToast = new ShowToast();
    this.toasterService = toasterService;
    this.investedValues = new AmountInvestedModel();
    this.validations = new Validations();
  }

  copyToClipboard(id) {
    /* Get the text field */
    const copyText = document.getElementById(id) as HTMLInputElement;

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand('Copy');
  }

  getValueOfCurrencyTypeCC(elem) {
    this.CreditCardType = elem;
  }

  isNumberKey(evt) {
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

  changeCreditCardCurrency(elem) {
    this.creditCardCurrency = elem;
  }

  changeWireCurrency(elem) {
    // this.wireCurrencySelected = elem;
    if (elem == 'MXN') {
      this.beneficiartBank = this.bankInfo.MXNBeneficiartBank;
      this.merchantBankName = this.bankInfo.MXNBankName;
      this.beneficiaryNomber = this.bankInfo.BeneficiaryNomber;
      this.merchantBankAccount = this.bankInfo.MXNAccountNumber;
      this.currencyRate = this.bankInfo.MXN;
      this.displayField = false;
    } else {
      this.branchCode = this.bankInfo.BranchCode;
      this.address = this.bankInfo.Address;
      this.beneficiartBank = this.bankInfo.BeneficiartBank;
      this.swift = this.bankInfo.SWIFT;
      this.beneficiaryNomber = this.bankInfo.BeneficiaryNomber;
      this.merchantBankName = this.bankInfo.IntermediaryBank;
      this.merchantBankAccount = this.bankInfo.AccountNumber;
      this.currencyRate = this.bankInfo.USD;
      this.displayField = true;
    }
  }

  getWalletAddresses() {
    this._walletService
      .getAddressesForWallets(this.userObject.UserId, this.currencyType)
      .subscribe(
        (a) => {
          if (a.code == 200) {
            const userObj = JSON.parse(localStorage.getItem('userObject'));
            if (userObj['twoFAStatus']) {
              this.isTwoFa = true;
              if (userObj['WalletAddress']) {
                this.isWalletAddress = true;
              }
            } else {
              this.isTwoFa = true;
              this.isWalletAddress = false;
            }
            this.walletInfo = a.data;
            if (
              this.walletInfo &&
              'isSaleStopped' in this.walletInfo &&
              this.walletInfo.isSaleStopped
            ) {
              this.RestrictionModalMessage = 'ICO sale currently Stopped';
              this.closeModal();
              $('#enable-2fa').modal('show');
            }
          }
        },
        (err) => {
          const obj = JSON.parse(err._body);
          if (obj.code == 401) {
            localStorage.clear();
            this.router.navigate(['/']);
          }
        }
      );
  }

  changeImage() {
    $('#imgInp').click();
  }

  changeimage(elem) {
    this.readURL(elem);
  }
  readURL(input) {
    let reader: any, target: EventTarget;
    reader = new FileReader();

    input = document.getElementById('imgInp');
    if (input.files && input.files[0]) {
      // var reader = new FileReader();
      const self = this;

      const ext = input.files[0].name.split('.').pop();

      if (
        ext == 'JPG' ||
        ext == 'jpg' ||
        ext == 'png' ||
        ext == 'PNG' ||
        ext == 'PDF' ||
        ext == 'pdf' ||
        ext == 'jpeg' ||
        ext == 'JPEG'
      ) {
      } else {
        this.userObject.Language == 'en'
          ? self.toasterService.pop('error', 'Error', 'File type not allowed')
          : self.toasterService.pop('error', 'Error', 'Formato no permitido');
        return false;
      }

      /* if (input.files[0].type.indexOf("image") == -1) {
        self.toasterService.pop('error', 'Error', "File type not allowed");
        return false;
      } */

      reader.onload = function (e) {
        console.info();
        const size = input.files[0].size / 1024 / 1024;
        if (size > 5) {
          this.userObject.Language == 'en'
            ? self.toasterService.pop(
                'error',
                'Error',
                'File is too large, please upload less than 5MB'
              )
            : self.toasterService.pop(
                'error',
                'Error',
                'El documento es muy pesado, favor de subir una imagen menor a 5mb'
              );
          return false;
        }

        const d = new Date().getTime();

        self.fileName = d;
        self.uploadedFile = input.files[0];
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  resetValues(currencyType, data) {
    this.walletInfo[currencyType] = data[currencyType];
  }

  getValueOfCurrencyTypePaidIn(elem) {
    this.currencyTypeUserPaidIn = elem;
  }

  emptyClaimForm() {
    this.instrumentId = undefined;
    this.bankName = undefined;
    this.currencyTypeUserPaidIn = undefined;
    this.uploadedFile = undefined;
    this.fileName = '';
    $('#imgInp').val('');
    $('.v-checkbox-wire-in-modal').prop('checked', false);
  }

  closeModal() {
    $('#wire-transfer').modal('hide');
    $('#enable-2fa').modal('hide');
    $('#view-instructions').modal('hide');
    $('#scan-QR').modal('hide');
    this.instrumentId = undefined;
    this.bankName = undefined;
    this.currencyTypeUserPaidIn = undefined;
    this.uploadedFile = undefined;
    this.fileName = '';
    $('#imgInp').val('');
    $('.v-checkbox-wire-in-modal').prop('checked', false);
  }

  print() {
    window.print();
  }

  submitClaim() {
    this.currencyTypeUserPaidIn = 'MXN';
    let error = false;
    this.toasterService.clear();

    if (!this.validations.verifyNameInputs(this.instrumentId)) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
            'error',
            'Error',
            'Please enter the instument Id'
          )
        : this.toasterService.pop('error', 'Error', 'Por favor ingresa tu INE');
      error = true;
    }

    if (!this.validations.verifyNameInputs(this.bankName)) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
            'error',
            'Error',
            'Please enter the bank name'
          )
        : this.toasterService.pop(
            'error',
            'Error',
            'Por favor ingresa el nombre del banco'
          );
      error = true;
    }

    if (
      this.currencyTypeUserPaidIn == undefined ||
      this.currencyTypeUserPaidIn == null
    ) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
            'error',
            'Error',
            'Please select your currency'
          )
        : this.toasterService.pop(
            'error',
            'Error',
            'Por favor seleccciona una moneda'
          );
      error = true;
    }

    if (this.uploadedFile == undefined || this.uploadedFile == null) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
            'error',
            'Error',
            'Please upload the photo of the receipt'
          )
        : this.toasterService.pop(
            'error',
            'Error',
            'Por favor envianos el comprobante de deposito.'
          );
      error = true;
    }

    if (error) {
    } else {
      this.submitClaimLoader = true;
      this.submitClaimBtn = false;

      this._walletService
        .claimWireTransfer(
          this.instrumentId,
          this.bankName,
          this.userObject.UserId,
          this.currencyTypeUserPaidIn,
          this.uploadedFile
        )
        .subscribe(
          (a) => {
            if (a.code == 200) {
              this.userObject.Language == 'en'
                ? this.toasterService.pop('success', 'Success', a.message)
                : this.toasterService.pop(
                    'success',
                    'Satisfactorioamente',
                    a.message
                  );
              this.submitClaimLoader = false;
              this.submitClaimBtn = true;
              setTimeout(() => {
                $('#wire-transfer').modal('hide');
                this.emptyClaimForm();
              }, 1500);
            }
          },
          (err) => {
            const obj = JSON.parse(err._body);
            if (obj.code == 401) {
              localStorage.clear();
              this.router.navigate(['/']);
            } else {
              this.toasterService.pop('error', 'Error', obj.message);
              this.submitClaimLoader = false;
              this.submitClaimBtn = true;
            }
          }
        );
    }
  }

  submitCreditCardInfo() {
    this.toasterService.clear();
    let error = false;

    if (this.creditCardNumber == undefined || this.creditCardNumber == null) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
            'error',
            'Error',
            'Please enter your Credit Card Number'
          )
        : this.toasterService.pop(
            'error',
            'Error',
            'Please enter your Credit Card Number'
          );
      error = true;
    }

    if (this.creditCardCvc == undefined || this.creditCardCvc == null) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
            'error',
            'Error',
            'Please enter your CVC Number'
          )
        : this.toasterService.pop(
            'error',
            'Error',
            'Please enter your CVC Number'
          );
      error = true;
    }

    if (this.CreditCardType == undefined || this.CreditCardType == null) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
            'error',
            'Error',
            'Please select credit card type'
          )
        : this.toasterService.pop(
            'error',
            'Error',
            'Please select credit card type'
          );
      error = true;
    }
  }

  getWalletAddressOnly(currencyType) {
    $('#box-loader-' + currencyType).show();

    this._walletService
      .getAddressesForWallets(this.userObject.UserId, currencyType)
      .subscribe(
        (a) => {
          console.log(a);

          if (a.code == 200) {
            $('#box-loader-' + currencyType).hide();
            this.currencyType = currencyType.toLowerCase();
            this.resetValues(this.currencyType, a.data);
          }
        },
        (err) => {
          $('#box-loader-' + currencyType).hide();
          const obj = JSON.parse(err._body);
          if (obj.code == 401) {
            localStorage.clear();
            this.router.navigate(['/']);
          }
        }
      );
  }

  navigateToSettings() {
    this.router.navigate(['/home/settings']);
  }

  updateGeneralSettings() {
    let error = false;

    this.toasterService.clear();

    if (
      this.userObject.WalletAddress == undefined ||
      this.userObject.WalletAddress == null
    ) {
      this.userObject.Language == 'en'
        ? this.toasterService.pop(
            'error',
            'Error',
            'Please enter a valid ETH Address'
          )
        : this.toasterService.pop('error', 'Error', 'Direccion ETH Invalida');
      error = true;
    }

    if (error) {
    } else {
      this.updateLoader = true;
      this.updateEth = false;
      this._userSerivce
        .changeGeneralSettings(
          this.userObject.UserId,
          this.userObject.Name,
          this.userObject.WalletAddress
        )
        .subscribe(
          (a) => {
            if (a.code == 200) {
              this.userObject.Language == 'en'
                ? this.toasterService.pop('success', 'Success', a.message)
                : this.toasterService.pop(
                    'success',
                    'Satisfactorioamente',
                    a.message
                  );
              this.noEthAddress = false;
              this.updateLoader = false;
              this.updateEth = true;
              localStorage.setItem(
                'userObject',
                JSON.stringify(this.userObject)
              );
            }
          },
          (err) => {
            const obj = JSON.parse(err._body);
            this.toasterService.pop('error', 'Error', obj.message);
            this.updateLoader = false;
            this.updateEth = true;

            if (obj.code == 401) {
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        );
    }
  }

  getInvestedData() {
    this._dashboardService
      .getAmountInvested(this.userObject.UserId)
      .takeWhile(() => this._alive)
      .subscribe(
        (a) => {
          if (a.code == 200) {
            this.investedValues = a.data;
            this.investedValues.TokenBalance = this.validations.toCommas(
              this.investedValues.TokenBalance
            );
            this.investedValues.EARNTokenBalance = this.validations.toCommas(
              this.investedValues.EARNTokenBalance
            );

            this._sharedService.showHideLoader(false);
          }
        },
        (err) => {
          const obj = JSON.parse(err._body);
          if (obj.code == 401) {
            localStorage.clear();
            this.router.navigate(['/']);
          }
        }
      );
  }

  OnDestroy() {
    this._alive = false;
  }

  getBankDetails(elem) {
    if (this.count > 0) {
      if (elem == 'CC') {
        this.LoaderCC = true;
        this.LoaderWire = false;
      } else {
        this.LoaderCC = false;
        this.LoaderWire = true;
      }
    }

    this._walletService.getBankDetails().subscribe(
      (a) => {
        if (a.code == 200) {
          this.LoaderWire = false;
          this.bankInfo = a.data;
          // if(this.wireCurrencySelected == "MXN"){
          if (this.wireCurrencySelected == 'AUD') {
            this.beneficiaryNomber = this.bankInfo.MXNBeneficiaryNomber;
            this.beneficiartBank = this.bankInfo.MXNBeneficiartBank;
            this.merchantBankName = this.bankInfo.MXNBankName;
            this.merchantBankAccount = this.bankInfo.MXNAccountNumber;
            this.currencyRate = Number(this.bankInfo.MXN).toFixed(8);
          } else if (this.wireCurrencySelected == 'USD') {
            this.beneficiaryNomber = this.bankInfo.BeneficiaryNomber;
            this.beneficiartBank = this.bankInfo.BeneficiartBank;
            this.branchCode = this.bankInfo.BranchCode;
            this.address = this.bankInfo.Address;
            this.swift = this.bankInfo.SWIFT;
            this.merchantBankName = this.bankInfo.IntermediaryBank;
            this.merchantBankAccount = this.bankInfo.AccountNumber;
            this.currencyRate = Number(this.bankInfo.USD).toFixed(8);
            this.currencyRateCreditCard = this.bankInfo.USD;
          } else {
            this.swift = this.bankInfo.SWIFT;
            this.beneficiaryNomber = this.bankInfo.BeneficiaryNomber;
            this.beneficiartBank = this.bankInfo.BeneficiartBank;
            this.branchCode = this.bankInfo.BranchCode;
            this.merchantBankName = this.bankInfo.IntermediaryBank;
            this.merchantBankAccount = this.bankInfo.AccountNumber;
            this.currencyRate = Number(this.bankInfo.USD).toFixed(8);
            this.currencyRateCreditCard = this.bankInfo.USD;
          }
          this.count = this.count + 1;
        }
      },
      (err) => {
        this.LoaderWire = false;
        const obj = JSON.parse(err._body);
        if (obj.code == 401) {
          localStorage.clear();
          this.router.navigate(['/']);
        }
      }
    );
  }

  public ngOnInit() {
    this.userToken = JSON.parse(localStorage.getItem('userToken'));
    this.bankObj = {
      AccountName: 'Piptle Wealth Management',
      BranchNumber: '064 475',
      AccountNumber: '1043 6665',
      BankName: 'Commonwealth Bank of Australia',
      BankAddress:
        'Shop 60, Stocklands Shopping Centre, 149 West Burleigh Rd, Burleigh Waters, QLD, 4220, Australia',
      Piptleaddressdetails:
        'Unit 36, 15 Jackman Street, Southport, Qld 4215 Australia'
    };
    this.bankdetails = JSON.stringify(this.bankObj);

    $('.list-unstyled li').removeClass('active');
    $('#wallet-nav').addClass('active');

    this.fileName = '';
    this._sharedService.showHideLoader(true);
    this.userObject = JSON.parse(localStorage.getItem('userObject'));
    if (this.userObject) {
      this.userId = this.userObject['UserId'];
      this.getTokens();
    }
    // this.showRestriction();
    this.getBankDetails('undefined');

    this.getInvestedData();
    this.getWalletAddresses();

    this.changeWireCurrency(this.wireCurrencySelected);
    if (
      this.userObject.WalletAddress == undefined ||
      this.userObject.WalletAddress == null
    ) {
      this.noEthAddress = true;
    } else {
      this.noEthAddress = false;
    }

    this._sharedService.updateAppLang$
      .pipe(takeWhile(() => this.isAlive))
      .subscribe((res) => {
        this.userObject = JSON.parse(localStorage.getItem('userObject'));
      });
  }

  getTokens() {
    this._userSerivce.getTokens(this.userId, this.userToken).subscribe(
      (res) => {
        if (res) {
          this.totalPiptles = res['data']['totalTokens'];
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getkycstatus() {
    this._sharedService.showHideLoader(true);
    this._userSerivce.getKycStatus(this.userObject.UserId).subscribe(
      (a) => {
        this.userObject.IsKycVerified = a.data.status;
        localStorage.setItem('userObject', JSON.stringify(this.userObject));
        this._sharedService.showHideLoader(false);
        this.showRestriction();
      },
      (err) => {
        this._sharedService.showHideLoader(false);
      }
    );
  }

  public showRestriction() {
    if (
      this.userObject.IsKycVerified == 'NOT_SUBMITTED' ||
      this.userObject.IsKycVerified == 'REJECTED'
    ) {
      this.RestrictionModalMessage = 'In order to buy Token please submit KYC';
      this.closeModal();
      $('#enable-2fa').modal('show');
    } else if (this.userObject.IsKycVerified == 'SUBMITTED') {
      this.RestrictionModalMessage =
        'Your KYC is under review of Fruture ICO team';
      this.closeModal();
      $('#enable-2fa').modal('show');
    } else {
      if (!this.userObject.twoFAStatus) {
        this.RestrictionModalMessage = 'You must enable 2FA to buy tokens';
        this.closeModal();
        $('#enable-2fa').modal('show');
      } else {
        this.closeModal();
      }
    }
  }
  public ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.closeModal();
    this.isAlive = false;
  }
  navigateToSetting() {
    this.closeModal();
    this.router.navigate(['/home/settings']);
  }
}
