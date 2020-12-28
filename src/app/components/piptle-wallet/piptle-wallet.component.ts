import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService';
declare var $: any;

@Component({
  selector: 'crypto-piptle-wallet',
  templateUrl: './piptle-wallet.component.html',
  styleUrls: ['./piptle-wallet.component.scss']
})
export class PiptleWalletComponent implements OnInit {
  userObj: any;
  userId: string;
  totalPiptles: number = 0;
  availablePiptles: number = 0;
  lockedPiptles: number = 0;
  stakedPiptles: number = 0;
  constructor(private userService: UserService) { }

  ngOnInit() {
    $(".list-unstyled li").removeClass("active");
    $("#piptle-wallet-nav").addClass("active");
    this.userObj = JSON.parse(localStorage.getItem('userObject'));    
		if (this.userObj) {
      this.userId = this.userObj['UserId']
      this.getTokens();
    }
  }

  getTokens(){
		this.userService.getTokens(this.userId).subscribe(res => {      
			if (res) {
        this.totalPiptles = res['data']['totalTokens'];
        this.availablePiptles = res['data']['availableTokens'];
        this.lockedPiptles = res['data']['lockedTokens'];
        this.stakedPiptles = res['data']['stakedTokens'];

			}
		}, err => {
			console.log(err);
		})		
	  }

}
