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
  transactionDetails = []

  constructor(private _sharedService: SharedService, private walletService: WalletServices) { }

  ngOnInit() {
    this.stakingHistory()
  }
  stakingHistory(){
    this._sharedService.showHideLoader(true);
    this.walletService.stakingHistory().subscribe(res => {
      if(res){
        this._sharedService.showHideLoader(false);
        console.log(res);
        this.transactionDetails = res.data
      }
    }, err => {
      this._sharedService.showHideLoader(false);
      var obj = JSON.parse(err._body)
      console.log(obj);
    })
  }
}
