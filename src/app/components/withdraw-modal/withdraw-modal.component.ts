import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AffilliateService } from 'src/app/services/affiliateService';

@Component({
  selector: 'crypto-withdraw-modal',
  providers: [AffilliateService],
  templateUrl: './withdraw-modal.component.html',
  styleUrls: ['./withdraw-modal.component.scss']
})
export class WithdrawModalComponent implements OnInit {
  @Input() totalEarningInUSD: number;
  public chains = [];
  public address = '';
  public amount = 0;
  public chain = '';
  public successMessage = '';
  public errorMessage = '';
  public amountMessage = '';
  public isSunday = false;

  constructor(
    public activeModal: NgbActiveModal,
    public _affilliateService: AffilliateService
  ) {}

  ngOnInit() {
    this.getSupportedChains();
    this.checkIfSunday();
  }

  close() {
    this.activeModal.dismiss('cancel');
  }

  confirm() {
    this.withdraw();
  }

  onchange(e) {
    const value = e.target.value;
    this.chain = value;
  }

  percentAmount: number = 0;

  onAmountInput(e: Event): void {
    const value = parseFloat((e.target as HTMLInputElement).value);

    if (isNaN(value) || value <= 0) {
      this.amount = 0;
      this.percentAmount = 0;
      this.amountMessage = 'Please enter a valid positive amount.';
      return;
    } else if (value > this.totalEarningInUSD) {
      this.amount = 0;
      this.percentAmount = 0;
      this.amountMessage = 'Amount should be less than available balance.';
      return;
    }

    this.amountMessage = '';
    this.amount = value;
    this.percentAmount = value * 0.99;
  }

  getSupportedChains() {
    this._affilliateService.getSupportedChains().subscribe(
      (a) => {
        if (a.code == 200 || a.code == 304) {
          this.chains = a.data;
        }
      },
      (err) => {
        let obj;
        if (err._body) {
          obj = JSON.parse(err._body);
        }
        console.log(obj);
        if (obj.code == 400) {
          console.log(obj.message);
        }
      }
    );
  }

  withdraw() {
    this._affilliateService
      .withdraw(this.address, this.amount, this.chain)
      .subscribe(
        (a) => {
          if (a.code == 200 || a.code == 304) {
            this.successMessage = `${a.message}`;
            this.errorMessage = '';
            setTimeout(() => this.activeModal.close('confirm'), 2000);
          }
        },
        (err) => {
          const obj = JSON.parse(err._body);
          console.log(obj);
          this.errorMessage = `${obj.message}`;
          this.successMessage = '';
        }
      );
  }

  checkIfSunday() {
    const today = new Date();
    // this.isSunday = today.getDay() === 0;
    this.isSunday = true;
    if (!this.isSunday) {
      this.errorMessage = 'Withdrawals are only processed on Sundays';
    }
  }
}
