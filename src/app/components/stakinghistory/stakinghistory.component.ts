import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared';
import { WalletServices } from 'src/app/services/walletServices';

@Component({
  selector: 'crypto-stakinghistory',
  templateUrl: './stakinghistory.component.html',
  styleUrls: ['./stakinghistory.component.scss'],
  providers: [WalletServices]
})
export class StakinghistoryComponent implements OnInit {
  transactionDetails = [];
  rewardDetails = [];

  constructor(
    private _sharedService: SharedService,
    private walletService: WalletServices
  ) {}

  ngOnInit() {
    this.stakingHistory();
    this.rewardHistory();
  }
  stakingHistory() {
    this._sharedService.showHideLoader(true);
    this.walletService.stakingHistory().subscribe(
      (res) => {
        if (res) {
          this._sharedService.showHideLoader(false);
          console.log(res);
          this.transactionDetails = res.data;
        }
      },
      (err) => {
        this._sharedService.showHideLoader(false);
        const obj = JSON.parse(err._body);
        console.log(obj);
      }
    );
  }
  rewardHistory() {
    this._sharedService.showHideLoader(true);
    this.walletService.rewardHistory().subscribe(
      (res) => {
        if (res) {
          this._sharedService.showHideLoader(false);
          console.log(res);
          this.rewardDetails = res.data;
        }
      },
      (err) => {
        this._sharedService.showHideLoader(false);
        const obj = JSON.parse(err._body);
        console.log(obj);
      }
    );
  }
}
