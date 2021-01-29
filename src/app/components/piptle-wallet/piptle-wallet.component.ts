import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/userService';
import {tronValidator} from '../../tronValidator';
import { WalletServices } from 'src/app/services/walletServices';
import { ToasterConfig, ToasterService } from 'angular2-toaster';
declare var $: any;

@Component({
  selector: 'crypto-piptle-wallet',
  templateUrl: './piptle-wallet.component.html',
  styleUrls: ['./piptle-wallet.component.scss'],
  providers: [WalletServices]
})
export class PiptleWalletComponent implements OnInit {
  userObj: any;
  userId: string;
  totalPiptles: number = 0;
  availablePiptles: number = 0;
  lockedPiptles: number = 0;
  stakedPiptles: number = 0;
  userToken : string;
  withDrawForm: FormGroup;
  modalReference: NgbModalRef;
  withDrawModal : NgbModalRef;
  isSubmitted: boolean = false;
  public config: ToasterConfig =
  new ToasterConfig({ animation: 'flyRight' });
  constructor(private userService: UserService 
    ,private readonly fb : FormBuilder, 
    private modalService: NgbModal, 
    private walletService : WalletServices,
    private toasterService: ToasterService,
    ) { }

  ngOnInit() {    
    this.withDrawForm = this.fb.group({
      address: ['',Validators.compose([Validators.required , tronValidator])],
      amount: ['' ,Validators.required],
    });
    $(".list-unstyled li").removeClass("active");
    $("#piptle-wallet-nav").addClass("active");
    this.userObj = JSON.parse(localStorage.getItem('userObject'));
    this.userToken = JSON.parse(localStorage.getItem('userToken'));     
		if (this.userObj) {
      this.userId = this.userObj['UserId']
      this.getTokens();
    }
  }

  openModal(content){
    this.modalReference = this.modalService.open(content, { centered: true , backdrop: 'static' }  );
  }
  getValue(event){
    if(event.target.value < 0){
      this.w.amount.setValue(0);
    }
  }
  closeModal(){
    this.modalReference.close();
    this.withDrawForm.reset()
  }

  getTokens(){
		this.userService.getTokens(this.userId, this.userToken).subscribe(res => {
			if (res) {
        this.totalPiptles = res['data']['totalTokens'];
        this.availablePiptles = res['data']['availableTokens'];
        this.lockedPiptles = res['data']['blockedTokens'];
        this.stakedPiptles = 0;
			}
		}, err => {
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
          }
        });
      } else{
        this.toasterService.pop('error','Error', "Insufficient Amount");
        this.isSubmitted = false;
      }
    }
}
