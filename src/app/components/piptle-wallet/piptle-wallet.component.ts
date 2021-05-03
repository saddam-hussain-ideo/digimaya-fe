import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/userService';
import {tronValidator} from '../../tronValidator';
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
  providers: [WalletServices, DashboardService]
})
export class PiptleWalletComponent implements OnInit {
  userObj: any;
  userId: string;
  totalPiptles: number = 0;
  referalBonus : number = 0;
  activityBonus: number = 0
  availablePiptles: number = 0;
  lockedPiptles: number = 0;
  stakedPiptles: number = 0;
  userToken : string;
  withDrawForm: FormGroup;
  modalReference: NgbModalRef;
  withDrawModal : NgbModalRef;
  isSubmitted: boolean = false;
  transactionDetails = []
  walletInfo;
  paginationNumber = 1;
  recentTransactionsPSize = 5
  currentPage = 1;
  convertedValue
  RatesModel
  public config: ToasterConfig =
  new ToasterConfig({ animation: 'flyRight' });
  constructor(private userService: UserService 
    ,private readonly fb : FormBuilder, 
    private modalService: NgbModal, 
    private walletService : WalletServices,
    private toasterService: ToasterService,
    private _sharedService: SharedService,
    private _dashboardService: DashboardService,
    private router: Router
    ) { }

  ngOnInit() {    
    this.withDrawForm = this.fb.group({
      address: ['',Validators.compose([Validators.required , tronValidator])],
      amount: ['' ,Validators.required],
      description: ['']
    });
    $(".list-unstyled li").removeClass("active");
    $("#piptle-wallet-nav").addClass("active");
    this.userObj = JSON.parse(localStorage.getItem('userObject'));
    this.userToken = JSON.parse(localStorage.getItem('userToken'));     
		if (this.userObj) {
      this.userId = this.userObj['UserId']
      this.getTokens();
      this.walletDetails()
      this.getRates()
    }
  }
  walletDetails(){
    this._sharedService.showHideLoader(true);
    const data = {
      userid : this.userId ,
      pagenumber: this.currentPage,
      pagesize: this.recentTransactionsPSize
    }
    this.walletService.transactionDetails(data).subscribe(res => {
      if(res){
        this._sharedService.showHideLoader(false);

        this.getWalletAddresses()
        console.log(res);
        this.transactionDetails = res.data.list
        this.paginationNumber = res.data.count;

      }
    }, err => {
      this._sharedService.showHideLoader(false);

      var obj = JSON.parse(err._body)
      console.log(obj);
    })
  }
  changePage(value) {
    console.log(value);

    this.currentPage = value;
    this.walletDetails();
}
  getWalletAddresses() {
    this._sharedService.showHideLoader(true);

    this.walletService.getAddressesForWallets(this.userId, '').subscribe(a => {
      console.log(a);
      
      if (a.code == 200) {
        this._sharedService.showHideLoader(false);

        this.walletInfo = a.data;        
        console.log(this.walletInfo);
        
      }
    }, err => {
      this._sharedService.showHideLoader(false);

      var obj = JSON.parse(err._body)
      console.log(obj);
      
    })
  }

  openModal(content){
    this.modalReference = this.modalService.open(content, { centered: true , backdrop: 'static' }  );
  }
  getValue(event){

    if(event.target.value < 0){
      this.w.amount.setValue(0);
    } else{
      const liveRate = this.RatesModel.liveRate
      this.convertedValue = +event.target.value * liveRate
    }
  }
  closeModal(){
    this.convertedValue = ''
    this.modalReference.close();
    this.withDrawForm.reset()
  }

  getRates() {

    this._dashboardService.getRates().subscribe(a => { 
        console.log(a);
                           
        if (a.code == 200) {
            this.RatesModel = a.data;            
        }

    }, err => {
        var obj = JSON.parse(err._body)
        if (obj.code == 401) {
            localStorage.clear();
            this.router.navigate(['/']);
        }
    })
}


  getTokens(){
    this._sharedService.showHideLoader(true);

		this.userService.getTokens(this.userId, this.userToken).subscribe(res => {
			if (res) {
        
        this.totalPiptles = res['data']['totalTokens'];
        this.availablePiptles = res['data']['availableTokens'];
        this.lockedPiptles = res['data']['blockedTokens'];
        this.stakedPiptles = 0;
        this.referalBonus = res['data']['referalBonus']
        this.activityBonus = res['data']['activityBonus']
			}
		}, err => {
      this._sharedService.showHideLoader(false);

			console.log(err);
		  })		
    }
    get w(){
      return this.withDrawForm.controls;
    }

    open(content){
      this.withDrawModal = this.modalService.open(content,{ centered: true, backdrop: 'static' })
    }

    submitDetails(form){
      if(form.invalid){
        return false
      }
      this.isSubmitted = true;
      let amount = this.w.amount.value;
      if(amount > 0 && amount <= this.availablePiptles){
        let data = form.value;
        this.walletService.withDrawWallet(data).subscribe(res => {
          if(res){
            this.toasterService.pop('success','Success', "Amount Withdrawn Successfully");
            this.isSubmitted = false;
            this.modalReference.close();
            this.convertedValue = ''
            this.getTokens()
            this.walletDetails()
            this.withDrawForm.reset()
          }
        }, err => {
          var obj = JSON.parse(err._body)
          this.toasterService.pop('error','Error', obj.message);
          this.isSubmitted = false;
        });
      } else{
        this.toasterService.pop('error','Error', "Insufficient Amount");
        this.isSubmitted = false;
      }
    }
}
