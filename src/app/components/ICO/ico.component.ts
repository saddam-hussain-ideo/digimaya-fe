import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ShowToast } from '../../showtoast';
import { Validations } from '../../validations';
import { UserSignupModel } from '../../models/userSignup.Model';
import { ICOService } from '../../services/icoService';
import { SharedService } from '../../services/shared';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import { StagesComponent } from '../stages/stages.component';
import { INFO_MODAL_CONSTANT } from './modals';
import { DashboardService } from 'src/app/services/dashboardService';

declare var $: any;
@Component({
  selector: 'my-wallet',
  providers: [ICOService, DashboardService],
  styleUrls: ['./ico.component.scss'],
  templateUrl: './ico.component.html'
})
export class IcoComponent {
  public userObject: any;
  public ICOInformation: any;
  public ICOStageInfoLeft: any;
  public ICOStageInfoRight: any;
  public investorsList: any;
  public leftProgressBar: any;
  public rightProgressBar: any;
  public noPendingStages = false;
  public hideSecondBox = false;

  public allICOStages = [];
  public numberOfIcoStage: any = 0;
  public stageWidth: any;

  public validations: Validations;
  public isSaleStopped = false;
  public stopEditingModal: NgbModalRef;
  globalInfo;
  currentStagePPTL = 0;
  currentStageeMy = 0;
  allCountries;
  currentILOStage;
  previousILOStage;
  founderPPTL = 0;
  foundereMy = 0;
  founderAudValue = 0;
  pptlDetails;
  pptlLoader = false;
  eMyLoader = false;
  noFounder = false;
  referralPSize = 20;
  paginationNumber = 1;
  currentPage = 1;
  topReferalCurrentPage = 1;
  levelOneBonus = 0;
  levelTwoBonus = 0;
  levelThreeBonus = 0;
  allStages;
  text: any = {
    Year: 'Year',
    Month: 'Month',
    Weeks: 'Weeks',
    Days: 'Days',
    Hours: 'Hours',
    Minutes: 'Minutes',
    Seconds: 'Seconds',
    MilliSeconds: 'MilliSeconds'
  };
  currentICOStageValue = 0;
  stagesNewData = [
    {
      name: 'ILO Stage 2',
      startingPoint: 501,
      target: 1000
    },
    {
      name: 'ILO Stage 3',
      startingPoint: 1001,
      target: 2000
    },
    {
      name: 'ILO Stage 4',
      startingPoint: 2001,
      target: 3000
    }
  ];
  stageLeftData;
  stageRightData;

  constructor(
    public _icoService: ICOService,
    public _sharedService: SharedService,
    public modalService: NgbModal,
    public _dashboardService: DashboardService
  ) {
    this.validations = new Validations();
  }
  public ngOnInit() {
    this._sharedService.showHideLoader(true);

    this.userObject = JSON.parse(localStorage.getItem('userObject'));
    this.getICOInformation();
    this.getIcoStagesBars();
    this.piptleDetails();
    $('.list-unstyled li').removeClass('active');
    $('#ico-nav').addClass('active');
  }

  piptleDetails() {
    this.pptlLoader = true;

    this._dashboardService
      .icoPiptleDetails(this.referralPSize, this.topReferalCurrentPage - 1)
      .subscribe(
        (res) => {
          this.pptlLoader = false;
          console.log(res);
          this.pptlDetails = res['data']['piptles'];
          this.paginationNumber = res['data']['count'];
        },
        (err) => {
          this.pptlLoader = false;
          const obj = JSON.parse(err._body);
          console.log(obj);
        }
      );
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  changePageForDetails(value) {
    this.topReferalCurrentPage = value;
    this.piptleDetails();
  }
  getIcoStagesBars() {
    this._icoService.getStagesForBars().subscribe(
      (a) => {
        if (a.code == 200) {
          this.allICOStages = a.data;
          this.numberOfIcoStage = this.allICOStages.length;
          this.stageWidth = 100 / this.numberOfIcoStage;

          for (let i = 0; i < this.allICOStages.length; i++) {
            if (
              this.allICOStages[i].StageName == 'Pre-ICO' &&
              this.allICOStages[i].soldPercentage >= 100
            ) {
              if (
                this.allICOStages.length >= i + 2 &&
                (this.allICOStages[i + 1].current == 'UPCOMING' ||
                  this.allICOStages[i + 1].current == 'RUNNING')
              ) {
                this.isSaleStopped = true;
              }
            } else {
              this.allICOStages[i];
            }
            let element = this.allICOStages[i].discount;
            element = element.replace('Discount', '');
            this.allICOStages[i].discount = element;
            if (this.allICOStages[i].soldPercentage > 100) {
              this.allICOStages[i].soldPercentage = 99.8;
            }
          }
        }
      },
      (err) => {
        const obj = JSON.parse(err._body);

        $('#snackbar').html(obj.message);

        this._sharedService.showHideLoader(false);
      }
    );
  }

  showTimer() {
    const countDownDate = new Date(this.ICOStageInfoLeft.endDate).getTime();

    // Update the count down every 1 second
    const x = setInterval(function () {
      // Get todays date and time
      const now = new Date().getTime();

      // Find the distance between now an the count down date
      const distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"

      $('#days').text(days);
      $('#hrs').text(hours);
      $('#mins').text(minutes);
      $('#sec').text(seconds);

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        document.getElementById('demo').innerHTML = 'EXPIRED';
      }
    }, 1000);
  }

  calculateLeftProgressBar() {
    this.leftProgressBar = (
      (this.ICOStageInfoLeft.amountSold /
        this.ICOStageInfoLeft.totalSaleAmount) *
      100
    ).toFixed(4);

    if (this.leftProgressBar > 100) {
      this.leftProgressBar = 99.8;
    }
    this._sharedService.showHideLoader(false);
  }

  calculateRightProgressBar() {
    this.rightProgressBar = (
      (this.ICOStageInfoRight.amountSold /
        this.ICOStageInfoRight.totalSaleAmount) *
      100
    ).toFixed(4);
    this.ICOStageInfoRight.totalSaleAmount = this.validations.toCommas(
      this.ICOStageInfoRight.totalSaleAmount
    );
  }

  getICOInformation() {
    this._icoService.getICOInformaion().subscribe(
      (a) => {
        if (a.code == 200) {
          console.log(a);

          this.ICOInformation = a.data;

          this.ICOInformation.hardCap = this.validations.toCommas(
            this.ICOInformation.hardCap
          );
          this.ICOInformation.softCap = this.validations.toCommas(
            this.ICOInformation.softCap
          );
          if (a.data.icoInformation.length == 0) {
            this.ICOStageInfoLeft = [];
            this.ICOStageInfoRight = [];
            this.noPendingStages = true;
            this._sharedService.showHideLoader(false);
          } else if (a.data.icoInformation.length == 1) {
            this.ICOStageInfoRight = [];
            this.noPendingStages = false;
            this.hideSecondBox = true;
            this.ICOStageInfoLeft = a.data.icoInformation[0];
            console.log(this.ICOStageInfoLeft);

            this.calculateLeftProgressBar();
          } else {
            this.ICOStageInfoLeft = a.data.icoInformation[0];
            console.log(this.ICOStageInfoLeft);

            this.ICOStageInfoRight = a.data.icoInformation[1];
            this.noPendingStages = false;
            this.calculateLeftProgressBar();
            this.calculateRightProgressBar();
          }
          const stageLeft = this.stagesNewData.find(
            (result) => result.name == this.ICOStageInfoLeft.stageName
          );
          if (stageLeft) {
            this.stageLeftData = stageLeft;
          }
          const stageRight = this.stagesNewData.find(
            (result) => result.name == this.ICOStageInfoRight.stageName
          );
          if (stageRight) {
            this.stageRightData = stageRight;
          }
          console.log(this.stageLeftData);
          console.log(this.stageRightData);
          console.log(this.ICOStageInfoRight);
          console.log(this.ICOStageInfoLeft);

          this.investorsList = a.data.investorList;
          for (let i = 0; i < this.investorsList.length; i++) {
            this.investorsList[i].EARNTokenBalance = this.validations.toCommas(
              this.investorsList[i].EARNTokenBalance
            );
            // this.investorsList[i].percentageSold = ((this.investorsList[i].AmountInvestedInMXN/a.data.totalAmountInvestedInUsd)* 100 );
            this.investorsList[i].AmountInvestedInUSD =
              this.validations.toCommas(
                this.investorsList[i].AmountInvestedInUSD
              );
          }
          this.showTimer();

          this.getILOStages();
        }
      },
      (err) => {
        const obj = JSON.parse(err._body);

        $('#snackbar').html(obj.message);

        this._sharedService.showHideLoader(false);
      }
    );
  }
  getILOStages() {
    this._sharedService.showHideLoader(true);

    this._dashboardService.getILOStages().subscribe(
      (a) => {
        this._sharedService.showHideLoader(false);

        console.log(a);
        this.globalInfo = a['data']['globalInfo'];
        console.log(this.globalInfo);
        this.allCountries = this.globalInfo.countries;
        const previousILOStage = a['data']['stagesInfo'];
        this.allStages = a['data']['stagesInfo'];
        console.log(previousILOStage);
        const index = previousILOStage.findIndex(
          (data) => data.StageName == this.ICOStageInfoLeft.stageName
        );
        console.log(index);
        this.previousILOStage = previousILOStage[index - 1];
        console.log(this.previousILOStage);
        console.log(this.ICOStageInfoLeft);
        this.currentStagePPTL = this.numberWithCommas(
          this.ICOStageInfoLeft.amountSold
        );
        const num =
          this.ICOStageInfoLeft.totalSaleAmount -
          this.ICOStageInfoLeft.amountSold;
        if (num) {
          this.currentICOStageValue = this.numberWithCommas(num);
        }
        if (this.previousILOStage == undefined) {
          this.noFounder = true;
          return;
        }
        this.founderPPTL = this.numberWithCommas(
          this.previousILOStage['TotalAmountSold']
        );
        this.founderAudValue =
          this.previousILOStage['TotalAmountSold'] *
          this.previousILOStage['StageRate'];
      },
      (err) => {
        this._sharedService.showHideLoader(false);

        const obj = JSON.parse(err._body);
        console.log(obj);
      }
    );
  }
  public invokeInfoModal(stagevalue) {
    const stage = this.allStages.find((stage) => stage.StageName == stagevalue);
    console.log(stage);
    this.levelOneBonus = stage.ReferralLevelOneBonuse;
    this.levelTwoBonus = stage.ReferralLevelTwoBonuse;
    this.levelThreeBonus = stage.ReferralLevelThreeBonuse;
    const modalConfig: NgbModalOptions = {
      // windowClass: 'info-modal-sm',
      // size: 'md',
      // ariaLabelledBy: 'info-modal',
      backdrop: 'static',
      centered: true
    };
    this.stopEditingModal = this.modalService.open(
      StagesComponent,
      modalConfig
    );
    if (stagevalue == 'ILO Stage 1') {
      console.log(INFO_MODAL_CONSTANT.STAGE_1);
      INFO_MODAL_CONSTANT.STAGE_1.primaryText.bonus0 = `${this.levelOneBonus}% of any PPTLs issued on Level 1`;
      INFO_MODAL_CONSTANT.STAGE_1.primaryText.bonus1 = `${this.levelTwoBonus}% of any PPTLs issued on Level 2`;
      INFO_MODAL_CONSTANT.STAGE_1.primaryText.bonus2 = `${this.levelThreeBonus}% of any PPTLs issued on Level 3`;
      this.stopEditingModal.componentInstance.modalData =
        INFO_MODAL_CONSTANT.STAGE_1;
    } else if (stagevalue == 'ILO Stage 2') {
      INFO_MODAL_CONSTANT.STAGE_2.primaryText.bonus0 = `${this.levelOneBonus}% of any PPTLs issued on Level 1`;
      INFO_MODAL_CONSTANT.STAGE_2.primaryText.bonus1 = `${this.levelTwoBonus}% of any PPTLs issued on Level 2`;
      INFO_MODAL_CONSTANT.STAGE_2.primaryText.bonus2 = `${this.levelThreeBonus}% of any PPTLs issued on Level 3`;

      this.stopEditingModal.componentInstance.modalData =
        INFO_MODAL_CONSTANT.STAGE_2;
    } else if (stagevalue == 'ILO Stage 3') {
      INFO_MODAL_CONSTANT.STAGE_3.primaryText.bonus0 = `${this.levelOneBonus}% of any PPTLs issued on Level 1`;
      INFO_MODAL_CONSTANT.STAGE_3.primaryText.bonus1 = `${this.levelTwoBonus}% of any PPTLs issued on Level 2`;
      INFO_MODAL_CONSTANT.STAGE_3.primaryText.bonus2 = `${this.levelThreeBonus}% of any PPTLs issued on Level 3`;
      this.stopEditingModal.componentInstance.modalData =
        INFO_MODAL_CONSTANT.STAGE_3;
    } else if (stagevalue == 'ILO Stage 4') {
      INFO_MODAL_CONSTANT.STAGE_4.primaryText.bonus0 = `${this.levelOneBonus}% of any PPTLs issued on Level 1`;
      INFO_MODAL_CONSTANT.STAGE_4.primaryText.bonus1 = `${this.levelTwoBonus}% of any PPTLs issued on Level 2`;
      INFO_MODAL_CONSTANT.STAGE_4.primaryText.bonus2 = `${this.levelThreeBonus}% of any PPTLs issued on Level 3`;
      this.stopEditingModal.componentInstance.modalData =
        INFO_MODAL_CONSTANT.STAGE_4;
    }

    this.stopEditingModal.componentInstance.emitUserOp.subscribe({
      next: this._confirmToStop
    });
  }

  private _confirmToStop = (response: { opStatus: string }) => {
    console.log(response);

    if (response.opStatus.toLowerCase() === 'confirmed') {
      // do operation
      console.log('Perform operation here!');
    }
  };
  closeModal() {
    $('#view-instructions').modal('hide');
  }
}
