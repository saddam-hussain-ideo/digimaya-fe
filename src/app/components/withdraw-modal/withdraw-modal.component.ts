import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AffilliateService } from 'src/app/services/affiliateService';

@Component({
  selector: 'crypto-withdraw-modal',
  providers: [AffilliateService],
  templateUrl: './withdraw-modal.component.html',
  styleUrls: ['./withdraw-modal.component.scss']
})
export class WithdrawModalComponent implements OnInit {
  public chains = [];
  public address = '';
  public amount = 0;
  public chain = '';
  public successMessage = '';
  public errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    public _affilliateService: AffilliateService
  ) {}

  ngOnInit() {
    this.getSupportedChains();
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
            // this.activeModal.close('confirm');
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
}
