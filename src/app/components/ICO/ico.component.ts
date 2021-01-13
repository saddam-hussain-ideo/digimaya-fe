import {
  Component,
  OnInit
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ShowToast } from '../../showtoast';
import { Validations } from '../../validations';
import { UserSignupModel } from '../../models/userSignup.Model';
import { ICOService } from '../../services/icoService';
import { SharedService } from '../../services/shared';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StagesComponent } from '../stages/stages.component';
import { INFO_MODAL_CONSTANT } from './modals';




declare var $: any;
@Component({

  selector: 'my-wallet',
  providers: [ICOService],
  styleUrls: ['./ico.component.scss'],
  templateUrl: './ico.component.html',
})
export class IcoComponent {

  public userObject: any;
  public ICOInformation: any;
  public ICOStageInfoLeft: any;
  public ICOStageInfoRight: any;
  public investorsList: any;
  public leftProgressBar: any;
  public rightProgressBar: any;
  public noPendingStages: boolean = false;
  public hideSecondBox: boolean = false;

  public allICOStages=[];
  public numberOfIcoStage:any =0 ;
  public stageWidth:any;

  public validations :Validations;
  public isSaleStopped = false;
  public stopEditingModal: NgbModalRef;

  text: any = {
    Year: 'Year',
    Month: 'Month',
    Weeks: "Weeks",
    Days: "Days",
    Hours: "Hours",
    Minutes: "Minutes",
    Seconds: "Seconds",
    MilliSeconds: "MilliSeconds"
  };


  constructor(public _icoService: ICOService, public _sharedService: SharedService, public modalService: NgbModal) {
     this.validations = new Validations();
  }
  public ngOnInit() {

    this._sharedService.showHideLoader(true);

    this.userObject = JSON.parse(localStorage.getItem("userObject"));

    this.getICOInformation();
    this.getIcoStagesBars();

    $(".list-unstyled li").removeClass("active");
    $("#ico-nav").addClass("active");

  }


  getIcoStagesBars(){
    this._icoService.getStagesForBars().subscribe(a=>{
  
      if(a.code == 200){
          this.allICOStages  = a.data;
          this.numberOfIcoStage = this.allICOStages.length;
          this.stageWidth = (100/this.numberOfIcoStage);

          for(var i = 0 ; i < this.allICOStages.length; i++){
            if(this.allICOStages[i].StageName == 'Pre-ICO' && this.allICOStages[i].soldPercentage >= 100){
              if(this.allICOStages.length >= i+2 && (this.allICOStages[i+1].current == 'UPCOMING' || this.allICOStages[i+1].current == 'RUNNING')){
                this.isSaleStopped = true;
              }
            }else{
              this.allICOStages[i]
            }
            let element = this.allICOStages[i].discount;
            element = element.replace('Discount', '')
            this.allICOStages[i].discount = element
            if(this.allICOStages[i].soldPercentage>100){
              this.allICOStages[i].soldPercentage = 99.8;
            }
          }
      }
    },err=>{
      
      var obj = JSON.parse(err._body);

      $("#snackbar").html(obj.message);

      this._sharedService.showHideLoader(false);

    })
  }


  showTimer() {

    var countDownDate = new Date(this.ICOStageInfoLeft.endDate).getTime();

    // Update the count down every 1 second
    var x = setInterval(function () {

      // Get todays date and time
      var now = new Date().getTime();

      // Find the distance between now an the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"

      $("#days").text(days);
      $("#hrs").text(hours);
      $("#mins").text(minutes);
      $("#sec").text(seconds);

      // If the count down is finished, write some text 
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "EXPIRED";
      }
    }, 1000);

  }


  calculateLeftProgressBar() {
    this.leftProgressBar = ((this.ICOStageInfoLeft.amountSold / this.ICOStageInfoLeft.totalSaleAmount) * 100).toFixed(4);

    if(this.leftProgressBar>100){
      this.leftProgressBar = 99.8;
    }
    this._sharedService.showHideLoader(false);
  }

  calculateRightProgressBar() {
    this.rightProgressBar = ((this.ICOStageInfoRight.amountSold / this.ICOStageInfoRight.totalSaleAmount) * 100).toFixed(4);
    this.ICOStageInfoRight.totalSaleAmount = this.validations.toCommas(this.ICOStageInfoRight.totalSaleAmount);
  }


  getICOInformation() {



    this._icoService.getICOInformaion().subscribe(a => {
      
      if (a.code == 200) {


        this.ICOInformation = a.data;
        console.log(this.ICOInformation);
        
        this.ICOInformation.hardCap = this.validations.toCommas(this.ICOInformation.hardCap);
        this.ICOInformation.softCap = this.validations.toCommas(this.ICOInformation.softCap);
        if (a.data.icoInformation.length == 0) {

          this.ICOStageInfoLeft = [];
          this.ICOStageInfoRight = [];
          this.noPendingStages = true;
          this._sharedService.showHideLoader(false);

        }
        else if (a.data.icoInformation.length == 1) {
          this.ICOStageInfoRight = [];
          this.noPendingStages = false;
          this.hideSecondBox = true;
          this.ICOStageInfoLeft = a.data.icoInformation[0];
          this.calculateLeftProgressBar()

        }
        else {
          this.ICOStageInfoLeft = a.data.icoInformation[0];
          this.ICOStageInfoRight = a.data.icoInformation[1];
          this.noPendingStages = false;
          this.calculateLeftProgressBar();
          this.calculateRightProgressBar();
        }


        this.investorsList = a.data.investorList;
        for(var i = 0; i<this.investorsList.length ; i++){
          this.investorsList[i].EARNTokenBalance = this.validations.toCommas(this.investorsList[i].EARNTokenBalance);
          // this.investorsList[i].percentageSold = ((this.investorsList[i].AmountInvestedInMXN/a.data.totalAmountInvestedInUsd)* 100 );
          this.investorsList[i].AmountInvestedInUSD = this.validations.toCommas(this.investorsList[i].AmountInvestedInUSD);
        }
        this.showTimer();



      }

    }, err => {

      var obj = JSON.parse(err._body);

      $("#snackbar").html(obj.message);

      this._sharedService.showHideLoader(false);

    })

  }
  
  public invokeInfoModal(stagevalue) {
    const modalConfig: NgbModalOptions = {
      // windowClass: 'info-modal-sm',
      // size: 'md',
      // ariaLabelledBy: 'info-modal',
      centered: true
    };
    // this.ser.open(StagesComponent, modalConfig)
    this.stopEditingModal = this.modalService.open(StagesComponent, modalConfig);
    if(stagevalue == 'stage1'){
      this.stopEditingModal.componentInstance.modalData = INFO_MODAL_CONSTANT.STAGE_1;
    } else if(stagevalue == 'stage2'){
      this.stopEditingModal.componentInstance.modalData = INFO_MODAL_CONSTANT.STAGE_2;
    }

  this.stopEditingModal.componentInstance.emitUserOp
  .subscribe({ next: this._confirmToStop });
  }
  
  private _confirmToStop = (response: { opStatus: string }) => {
    console.log(response);
    
    if (response.opStatus.toLowerCase() === 'confirmed') {
      // do operation
      console.log('Perform operation here!');
    }
  }

}  