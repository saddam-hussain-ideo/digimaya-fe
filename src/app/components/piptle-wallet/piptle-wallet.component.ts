import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'crypto-piptle-wallet',
  templateUrl: './piptle-wallet.component.html',
  styleUrls: ['./piptle-wallet.component.scss']
})
export class PiptleWalletComponent implements OnInit {
  
  constructor() { }

  ngOnInit() {
    $(".list-unstyled li").removeClass("active");
    $("#piptle-wallet-nav").addClass("active");
  }

}
