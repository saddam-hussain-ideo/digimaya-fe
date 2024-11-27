import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/userService';
import { tronValidator } from '../../tronValidator';
import { WalletServices } from 'src/app/services/walletServices';
import { ToasterConfig, ToasterService } from 'angular2-toaster';
import { SharedService } from 'src/app/services/shared';
import { DashboardService } from 'src/app/services/dashboardService';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'crypto-piptle-wallet',
  templateUrl: './piptle-wallet.component.html',
  styleUrls: ['./piptle-wallet.component.scss'],
  providers: [WalletServices, DashboardService, UserService]
})
export class PiptleWalletComponent implements OnInit {
  userObj: any;
  arr = [];
  isChecked = false;
  twoFaStatus: boolean;
  twoFaLoader = false;
  userId: string;
  totalPiptles = 0;
  referalBonus = 0;
  activityBonus = 0;
  availablePiptles = 0;
  lockedPiptles = 0;
  stakedPiptles = 0;
  stakeTokens = 0;
  userToken: string;
  withDrawForm: FormGroup;
  stakingForm: FormGroup;
  transferForm: FormGroup;
  twoFaForm: FormGroup;
  modalReference;
  modalRef;
  withDrawModal: NgbModalRef;
  isSubmitted = false;
  transactionDetails = [];
  walletInfo;
  paginationNumber = 1;
  recentTransactionsPSize = 5;
  currentPage = 1;
  convertedValue;
  RatesModel;
  tronAddress: string;
  tronRef: string;
  saveLoader = false;
  STAKING_PERIODS = {
    60: 0.6,
    90: 0.65,
    120: 0.7,
    180: 0.75,
    360: 0.8,
    480: 1.0
  };
  stakingDuration;
  public config: ToasterConfig = new ToasterConfig({ animation: 'flyRight' });
  constructor(
    private userService: UserService,
    private readonly fb: FormBuilder,
    private modalService: NgbModal,
    private walletService: WalletServices,
    private toasterService: ToasterService,
    private _sharedService: SharedService,
    private _dashboardService: DashboardService,
    private router: Router,
    private _userService: UserService
  ) {}

  ngOnInit() {
    this.withDrawForm = this.fb.group({
      address: ['', Validators.compose([Validators.required, tronValidator])],
      amount: ['', Validators.required],
      description: [''],
      reference: ['']
    });
    this.transferForm = this.fb.group({
      username: ['', Validators.required],
      amount: ['', Validators.required]
    });
    this.stakingForm = this.fb.group(
      {
        amount: ['', Validators.compose([Validators.required])],
        days: ['']
      },
      {
        validator: (group) => {
          const duration = group.controls['days'];
          this.stakeTokens == 0 ? duration.setErrors({ required: true }) : null;
        }
      }
    );
    console.log(this.stakingForm);

    this.twoFaForm = this.fb.group({
      twoFa: ['', [Validators.required, Validators.minLength(6)]]
    });
    $('.list-unstyled li').removeClass('active');
    $('#piptle-wallet-nav').addClass('active');
    this.userObj = JSON.parse(localStorage.getItem('userObject'));
    this.userToken = JSON.parse(localStorage.getItem('userToken'));
    if (this.userObj) {
      this.userId = this.userObj['UserId'];
      this.twoFaStatus = this.userObj['twoFAStatus'];

      this.getTokens();
      this.walletDetails();
      this.getRates();
    }
  }
  walletDetails() {
    this._sharedService.showHideLoader(true);
    const data = {
      userid: this.userId,
      pagenumber: this.currentPage,
      pagesize: this.recentTransactionsPSize
    };
    this.walletService.transactionDetails(data).subscribe(
      (res) => {
        if (res) {
          this._sharedService.showHideLoader(false);

          this.getWalletAddresses();
          console.log(res);
          this.transactionDetails = res.data.list;
          this.paginationNumber = res.data.count;
        }
      },
      (err) => {
        this._sharedService.showHideLoader(false);

        const obj = JSON.parse(err._body);
        console.log(obj);
      }
    );
  }
  changePage(value) {
    console.log(value);

    this.currentPage = value;
    this.walletDetails();
  }

  getWalletAddresses() {
    this._sharedService.showHideLoader(true);

    this.walletService.getAddressesForWallets(this.userId, '').subscribe(
      (a) => {
        console.log(a);

        if (a.code == 200) {
          this._sharedService.showHideLoader(false);

          this.walletInfo = a.data;
          console.log(this.walletInfo);
        }
      },
      (err) => {
        this._sharedService.showHideLoader(false);

        const obj = JSON.parse(err._body);
        console.log(obj);
      }
    );
  }

  openModal(content) {
    this.modalReference = this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }
  openWithdraw(content) {
    this.modalRef = this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
    this.retrieveWallet();
  }
  getValue(event) {
    if (event.target.value < 0) {
      this.w.amount.setValue(0);
    } else {
      const liveRate = this.RatesModel.liveRate;
      this.convertedValue = +event.target.value * liveRate;
    }
  }
  closeModal() {
    this.convertedValue = '';
    this.modalReference.close();
  }
  close() {
    this.stakingForm.reset();
    this.transferForm.reset();
    this.modalRef.close();
  }

  getRates() {
    this._dashboardService.getRates().subscribe(
      (a) => {
        console.log(a);

        if (a.code == 200) {
          this.RatesModel = a.data;
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

  getTokens() {
    this._sharedService.showHideLoader(true);

    this.userService.getTokens(this.userId, this.userToken).subscribe(
      (res) => {
        if (res) {
          console.log(res);

          this.totalPiptles = res['data']['totalTokens'];
          this.availablePiptles = res['data']['availableTokens'];
          this.lockedPiptles = res['data']['blockedTokens'];
          this.stakedPiptles = res['data']['stakingBonus'];
          this.referalBonus = res['data']['referalBonus'];
          this.activityBonus = res['data']['activityBonus'];
          this.stakeTokens = res['data']['stakedTokens'];
          this._sharedService.showHideLoader(false);
        }
      },
      (err) => {
        this._sharedService.showHideLoader(false);

        console.log(err);
      }
    );
  }
  get withDrawform() {
    return this.withDrawForm;
  }
  get s() {
    return this.stakingForm.controls;
  }
  get tt() {
    return this.transferForm.controls;
  }
  get w() {
    return this.withDrawForm.controls;
  }
  get t() {
    return this.twoFaForm.controls;
  }
  open(content) {
    this.withDrawModal = this.modalService.open(content, {
      centered: true,
      backdrop: 'static'
    });
  }

  submitDetails(form) {
    if (form.invalid) {
      return false;
    }
    this.isSubmitted = true;
    const amount = this.w.amount.value;
    if (amount > 0 && amount <= this.availablePiptles) {
      const data = {
        address: form.value.address,
        amount: form.value.amount,
        note: form.value.description
      };
      console.log(data);

      this.walletService.withDrawWallet(data).subscribe(
        (res) => {
          if (res) {
            this.toasterService.pop(
              'success',
              'Success',
              'Amount Withdrawn Successfully'
            );
            this.isSubmitted = false;
            this.modalRef.close();
            if (this.twoFaLoader) {
              this.modalReference.close();
              this.twoFaLoader = false;
            }
            this.convertedValue = '';
            this.getTokens();
            this.walletDetails();
            this.withDrawForm.reset();
            this.isChecked = false;
          }
        },
        (err) => {
          const obj = JSON.parse(err._body);
          this.toasterService.pop('error', 'Error', obj.message);
          this.isSubmitted = false;
        }
      );
    } else {
      this.toasterService.pop('error', 'Error', 'Insufficient Amount');
      this.isSubmitted = false;
    }
  }
  retrieveWallet() {
    this.userService.retrieveWallet(this.userToken).subscribe(
      (res) => {
        console.log(res);

        this.tronAddress = res['data']['TronWalletAddress'];
        this.tronRef = res['data']['TronWalletReference'];
        this.w.address.setValue(this.tronAddress);
        this.w.reference.setValue(this.tronRef);
      },
      (err) => {
        console.log(err);
        this.toasterService.pop('error', 'Error', 'Insufficient Amount');
      }
    );
  }
  saveAddress(event, reference) {
    console.log(event);
    console.log(reference.value);

    if (event.status == 'INVALID') {
      console.log('invalid');
      return;
    }
    this.saveLoader = true;
    let data;
    if (!reference.value) {
      data = {
        tronAddress: event.value
      };
    } else {
      data = {
        tronAddress: event.value,
        reference: reference.value
      };
    }
    console.log(data);

    this.userService.saveWallet(data, this.userToken).subscribe(
      (res) => {
        console.log(res);
        if (res) {
          this.saveLoader = false;
          this.toasterService.pop(
            'success',
            'Success',
            'Wallet added successfully'
          );
        }
      },
      (err) => {
        const obj = JSON.parse(err._body);
        console.log(obj);
        this.saveLoader = false;
        this.toasterService.pop('error', 'Error', obj.message);
      }
    );
  }
  checked(value) {
    console.log(value);
    if (value) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }
  submitCode(form) {
    if (form.invalid) {
      console.log('invalid');
    }
    const code = form.value.twoFa;
    console.log(code);

    this.twoFaVerification(code);
    console.log(this.userObj);
  }

  twoFaVerification(code) {
    this.twoFaLoader = true;
    this._userService.authenticate2FALogin(this.userObj.Email, code).subscribe(
      (a) => {
        console.log(a);

        if (a.code == 200) {
          localStorage.setItem('userObject', JSON.stringify(a.data));
          localStorage.setItem('userToken', JSON.stringify(a.data.token));
          const obj = this.withDrawform;
          this.submitDetails(obj);
        }
      },
      (err) => {
        const obj = JSON.parse(err._body);
        console.log(obj);

        this.toasterService.pop('error', 'Error', obj.message);
        this.twoFaLoader = false;
      }
    );
  }
  duration(e) {
    console.log(e.target.value);
    console.log(this.stakingForm);
    this.s.days.setValue(e.target.value);
    if (e.target.value != '') {
      this.s.days.setErrors(null);
    }
    console.log(this.s.days);
  }
  stakeCoins(form) {
    if (form.invalid) {
      return false;
    }
    this.isSubmitted = true;
    const amount = this.s.amount.value;
    const duration = this.s.days.value;
    console.log(duration);

    if (amount > 0 && amount <= this.availablePiptles) {
      const data = {
        amount: amount,
        period: duration == '' ? undefined : duration
      };
      console.log(data);

      this.walletService.stakeCoins(data).subscribe(
        (res) => {
          if (res) {
            this.toasterService.pop(
              'success',
              'Success',
              'Amount Staked Successfully'
            );
            this.isSubmitted = false;
            this.modalRef.close();
            this.getTokens();
            this.stakingForm.reset();
          }
        },
        (err) => {
          this.isSubmitted = false;
          const obj = JSON.parse(err._body);
          this.toasterService.pop('error', 'Error', obj.message);
        }
      );
    } else {
      this.toasterService.pop('error', 'Error', 'Insufficient Amount');
      this.isSubmitted = false;
    }
  }

  transferCoins(form) {
    if (form.invalid) {
      return false;
    }
    this.isSubmitted = true;
    const amount = this.tt.amount.value;
    const username = this.tt.username.value;

    if (amount > 0 && amount <= this.availablePiptles) {
      const data = {
        amount: amount,
        userName: username
      };
      this.walletService.transferCoins(data).subscribe(
        (res) => {
          if (res) {
            this.toasterService.pop(
              'success',
              'Success',
              'Amount Transfered Successfully'
            );
            this.isSubmitted = false;
            this.modalRef.close();
            this.getTokens();
            this.transferForm.reset();
          }
        },
        (err) => {
          this.isSubmitted = false;
          const obj = JSON.parse(err._body);
          this.toasterService.pop('error', 'Error', obj.message);
        }
      );
    } else {
      this.toasterService.pop('error', 'Error', 'Insufficient Amount');
      this.isSubmitted = false;
    }
  }
}
