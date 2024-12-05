import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

import { ActivatedRoute, Router } from '@angular/router';
import { AffilliateService } from '../../services/affiliateService';
import { Validations } from '../../validations';
import { SharedService } from '../../services/shared';

declare var $: any;
@Component({
  selector: 'affiliate',
  providers: [AffilliateService],
  styleUrls: ['./affiliate.style.scss'],
  templateUrl: './affiliate.template.html'
})
export class Affiliate {
  public userObject: any;
  public topReferrals: any;
  public affiliateLink: any;
  public affiliateCode: any;
  public myAffilliates: any;
  public noMyAffilliates = false;

  public noTopAffilliates = false;

  public validations: Validations;

  public affiliateEarningsPageSize = 5;
  public affiliateEarningsPageNumber = 1;
  public totalAffiliateEarningsRecords: any;
  public totalAffiliateCurrentPage = 1;
  public totalAffiliatesArray = [];
  public csvData: any;
  public totalEarningInEMYA: any;
  public totalEarningInUSD: any;

  public dataFilter = 'DAY';
  public noGraphData = false;

  public myAffiliatesPageSize = 5;
  public myAffiliatesPageNumber = 1;
  public totalAffiliatesForUser: any;
  public myAffiliatesCurrentPage = 1;
  public graphLoader = false;

  public fivePercentOfTotalAmountInvested: any;
  public noAffiliateEarners = false;
  tableLoader1: boolean;
  tableLoader2: boolean;
  tableLoader3: boolean;
  topRefersLoader: boolean;
  affiliatesLoader: boolean;
  referralLevel: number;
  pageNo;
  pageSize;
  rowsData;
  levelOneData;
  levelTwoData;
  levelThreeData;
  obj;
  dataArr = [];
  referalLicencesCount = {
    gpa: 0,
    other: 0
  };
  networkIssuedPPTL = 0;
  referredCountries = 0;
  referralPSize = 5;
  paginationNumber = 1;
  topReferalCurrentPage = 1;
  tableOneCurrentPage = 1;
  tableOneSize = 5;
  tableOneCount = 1;

  tableTwoCurrentPage = 1;
  tableTwoSize = 5;
  tableTwoCount = 1;

  tableThreeCurrentPage = 1;
  tableThreeSize = 5;
  tableThreeCount = 1;

  constructor(
    public router: Router,
    public _affilliateService: AffilliateService,
    public _sharedService: SharedService
  ) {
    this.validations = new Validations();
  }

  public lineChartData: Array<any> = [{ data: [], label: 'Series A' }];
  public lineChartLabels: Array<any> = [];


  public lineChartOptions: any = {
    responsive: true,
    legend: {
      display: false
    },

    scales: {
      yAxes: [
        {
          gridLines: {
            color: 'rgba(187, 220, 216,0.3)',
            opacity: 0.3,
            borderDash: [8, 4]
          },
          ticks: {
            beginAtZero: true,
            fontColor: '#616A75',
            fontSize: 13,
            fontFamily: 'LatoWeb'
          }
        }
      ],

      xAxes: [
        {
          gridLines: {
            color: 'transparent',
            borderDash: [8, 4]
          },
          ticks: {
            beginAtZero: true,
            fontColor: '#616A75',
            fontSize: 13,
            fontFamily: 'LatoWeb'
          }
        }
      ]
    },

    tooltips: {
      custom: function (tooltip) {
        if (!tooltip) {
          return;
        }
        // disable displaying the color box;
        tooltip.displayColors = false;
      },
      callbacks: {
        // use label callback to return the desired label
        label: function (tooltipItem, data) {
          return tooltipItem.xLabel + ' :' + tooltipItem.yLabel;
        },
        // remove title
        title: function (tooltipItem, data) {
          return;
        }
      },
      titleFontFamily: 'LatoWebBold',
      bodyFontFamily: 'LatoWebLight',
      titleFontColor: '#0066ff'
    },
    elements: {
      line: {
        tension: 0
      },
      point: {
        radius: 0
      }
    }
  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(74,193,180,0.2)',
      // borderColor: 'rgba(74,193,180,1)'
      borderColor: '#643E8D'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  getGraphByFilter(elem) {
    this.dataFilter = elem;
    this.affiliateGraph();
  }

  changePageNumberForMyAffiliates(event) {
    this.myAffiliatesPageNumber = event;
    this.getTopAffiliates();
  }

  changePageNumber(event) {
    this.affiliateEarningsPageNumber = event;
    this.getAffiliateEarnings(this.affiliateEarningsPageNumber);
  }

  changePageForTopReferrals(value) {
    this.topReferalCurrentPage = value;
    this.getTopReferrals();
  }
  changePageForTable1(value) {
    this.tableOneCurrentPage = value;
    this.levelOneReferrals();
  }

  changePageForTable2(value) {
    this.tableTwoCurrentPage = value;
    this.levelTwoReferrals();
  }
  changePageForTable3(value) {
    this.tableThreeCurrentPage = value;
    this.levelThreeReferrals();
  }

  public ctx;

  public ngOnInit() {
    this.userObject = JSON.parse(localStorage.getItem('userObject'));

    this.affiliateGraph();
    $('#test1').prop('checked', true);
    this.affiliateLink = this.userObject.AffiliateLink;
    this.affiliateCode = this.userObject.AffiliateLink.substr(
      this.userObject.AffiliateLink.lastIndexOf('/') + 1
    );

    this.getTopReferrals();
    this.getTopAffiliates();
    this.getAffiliateEarnings(this.affiliateEarningsPageNumber);
    this.affiliateGraph();
    // this.getReferrals()
    this.levelOneReferrals();
    this.levelTwoReferrals();
    this.levelThreeReferrals();
    console.log(this.affiliatesLoader, "affiliatesLoader in ngonit");

    $('.list-unstyled li').removeClass('active');
    $('#aff-nav').addClass('active');

    $('.accordion').click(function () {
      $('.faq-main-2 .fas').removeClass('fa-minus').addClass('fa-plus');

      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).next().removeClass('show');

        $('.faq-main-2 .fas').removeClass('fa-minus').addClass('fa-plus');
      } else {
        $('.accordion').removeClass('active');
        $('.panel').removeClass('show');
        $(this).find('.fas').removeClass('fa-plus').addClass('fa-minus');

        $(this).addClass('active');
        $(this).next().addClass('show');
      }
    });

    /* Graph */

    $('.affiliate-graph-ul > li').click(function () {
      $('.affiliate-graph-ul li').removeClass('affiliate-active-li');
      $(this).addClass('affiliate-active-li');
    });
    // this._sharedService.showHideLoader(false);
  }

  // getReferrals(){
  //     this._sharedService.showHideLoader(true);
  //     console.log(this.levelOneData);
  //                 console.log(this.levelTwoData);
  //                 console.log(this.levelThreeData);
  //                 this.tableLoader1 = true
  //         this.tableLoader2 = true

  //         this.tableLoader3 = true
  //     for(let i = 1; i <= 3 ; i++) {

  //         this._affilliateService.levelReferrals(this.userObject.UserId, this.referralLevel = i,this.pageNo = 1, this.pageSize= 10 )
  //         .subscribe(res => {
  //             console.log(res);
  //             if(res){
  //                 this._sharedService.showHideLoader(false);
  //                 this.referredCountries = res['data']['referred_countries']
  //                 this.obj = {
  //                     level : i,
  //                     data : res['data']
  //                 }
  //                 this.dataArr.push(this.obj)
  //                 console.log(this.dataArr);

  //                 this.levelOneData = this.dataArr.find(result => result.level == 1)

  //                 this.levelTwoData = this.dataArr.find(result => result.level == 2)
  //                 this.levelThreeData = this.dataArr.find(result => result.level == 3)
  //                 console.log(this.levelOneData);
  //                 console.log(this.levelTwoData);
  //                 console.log(this.levelThreeData);

  //                 if(this.levelOneData){
  //                     this.tableLoader1 = false
  //                     this.tableOneCount = this.levelOneData.data.totalRecords
  //                     console.log(this.tableOneCount);

  //                     // this.referredCountries = this.levelOneData['data']['referred_countries']
  //                 }
  //                 if(this.levelTwoData){
  //                     this.tableLoader2 = false
  //                     this.tableTwoCount = this.levelTwoData.data.totalRecords

  //                 }
  //                 if(this.levelThreeData){
  //                     this.tableLoader3 = false
  //                     this.tableThreeCount = this.levelThreeData.data.totalRecords

  //                 }

  //             }
  //         }, err => {
  //             this.tableLoader1 = false
  //             this.tableLoader2 = false

  //             this.tableLoader3 = false
  //             this._sharedService.showHideLoader(false);
  //             console.log(err);
  //             const obj = JSON.parse(err._body);
  //             console.log('Level' , i ,obj);

  //         })
  //     }

  // }

  levelOneReferrals() {
    this.tableLoader1 = true;
    this._affilliateService
      .levelReferrals(
        this.userObject.UserId,
        (this.referralLevel = 1),
        this.tableOneCurrentPage,
        this.tableOneSize
      )
      .subscribe(
        (res) => {
          console.log(res);
          if (res) {
            this.tableLoader1 = false;
            this.referredCountries = res['data']['referred_countries'];
            this.levelOneData = res['data'];
            console.log(this.levelOneData, "levelonedata");

            this.tableOneCount = this.levelOneData.length;
          }
        },
        (err) => {
          this.tableLoader1 = false;
          let obj
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);
        }
      );
  }

  levelTwoReferrals() {
    this.tableLoader2 = true;
    this._affilliateService
      .levelReferrals(
        this.userObject.UserId,
        (this.referralLevel = 2),
        this.tableTwoCurrentPage,
        this.tableTwoSize
      )
      .subscribe(
        (res) => {
          console.log(res);
          if (res) {
            this.tableLoader2 = false;
            this.levelTwoData = res['data'];
            this.tableTwoCount = this.levelTwoData.length;
          }
        },
        (err) => {
          this.tableLoader2 = false;
          let obj
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);
        }
      );
  }

  levelThreeReferrals() {
    this.tableLoader3 = true;
    this._affilliateService
      .levelReferrals(
        this.userObject.UserId,
        (this.referralLevel = 3),
        this.tableThreeCurrentPage,
        this.tableThreeSize
      )
      .subscribe(
        (res) => {
          console.log(res);
          if (res) {
            this.tableLoader3 = false;
            this.levelThreeData = res['data'];
            this.tableThreeCount = this.levelThreeData.length;
          }
        },
        (err) => {
          this.tableLoader3 = false;
          let obj
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);
        }
      );
  }

  affiliateGraph() {
    this.graphLoader = true;

    this._affilliateService
      .getAffiliatesGraph(this.userObject.UserId, this.dataFilter)
      .subscribe(
        (a) => {
          if (a.code == 200) {
            this.graphLoader = false;
            console.log(a);

            this.lineChartData[0].data = a.data.values;
            this.lineChartLabels = a.data.dates;
            this.noGraphData = false;
          }
        },
        (err) => {
          this.graphLoader = false;
          let obj
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          if (obj.code == 400) {
            this.noGraphData = true;
          }

          if (obj.code == 401) {
            localStorage.clear();
            this.router.navigate(['/']);
          }
        }
      );
  }

  getAffiliateEarnings(pageNumber) {
    this.affiliatesLoader = true;
    this._sharedService.showHideLoader(true);
    this._affilliateService
      .getAffiliateEarnings(
        this.userObject.UserId,
        pageNumber,
        this.affiliateEarningsPageSize
      )
      .subscribe(
        (a) => {
          console.log(a);
          this.affiliatesLoader = false;

          if (a.code == 200 || a.code == 304) {
            this.affiliatesLoader = false;
            this._sharedService.showHideLoader(false);
            this.noAffiliateEarners = false;
            this.totalAffiliateEarningsRecords = a.data.Count;
            this.totalEarningInEMYA = a.data.totalEarningInEMYA;
            this.totalEarningInUSD = a.data.totalEarningInAud;
            this.totalAffiliatesArray = a.data.earningList;
            this.referalLicencesCount = {
              gpa: a.data.referralLicencesCount['gpa'],
              other: a.data.referralLicencesCount['other']
            };
            this.networkIssuedPPTL = a.data.referralIssuedPptls;
            console.log(this.affiliatesLoader, "affiliatesLoader");
          }
        },
        (err) => {
          this._sharedService.showHideLoader(false);
          this.affiliatesLoader = false;
          let obj
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);

          if (obj.code == 400) {
            // show empty error
            this._sharedService.showHideLoader(false);
            this.noAffiliateEarners = true;
          }
          if (obj.code == 401) {
            localStorage.clear();
            this.router.navigate(['/']);
          }
        }
      );
  }

  ConvertToCSV(objArray) {
    debugger;
    const array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index in array[i]) {
        if (line != '') {
          line += ',';
        }

        line += array[i][index];
      }

      str += line + '\r\n';
    }

    return str;
  }

  downloadCSV() {
    this._sharedService.showHideLoader(true);

    this._affilliateService.getCsvData(this.userObject.UserId).subscribe(
      (a) => {
        console.log(a);

        if (a.code == 200) {
          debugger;
          this.csvData = a.data.earningList;

          const jsonObject = JSON.stringify(this.csvData);

          // Convert JSON to CSV & Display CSV
          const parsedResponse = this.ConvertToCSV(jsonObject);

          const blob = new Blob([parsedResponse], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const d = new Date().getTime();
          if ((window.navigator as any).msSaveOrOpenBlob) {
            (window.navigator as any).msSaveBlob(blob, d + '.csv');
          } else {
            const a = document.createElement('a');
            a.href = url;
            a.download = d + '.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }

          this._sharedService.showHideLoader(false);

          window.URL.revokeObjectURL(url);
        }
      },
      (err) => {
        let obj
        if (err._body) {
          obj = JSON.parse(err._body);
        }

        if (obj.code == 400) {
          this._sharedService.showHideLoader(false);
        }

        if (obj.code == 401) {
          localStorage.clear();
          this.router.navigate(['/']);
        }
      }
    );
  }

  getTopReferrals() {
    this.topRefersLoader = true;
    this._affilliateService
      .getTopReferrals(this.topReferalCurrentPage, this.referralPSize)
      .subscribe(
        (a) => {
          console.log(a);

          if (a.code == 200) {
            this.topRefersLoader = false;
            this.topReferrals = a.data.rows;
            this.paginationNumber = a.data.totalRecords;

            // this.fivePercentOfTotalAmountInvested = ((a.data.totalAmountInvestedInUsd * 5) / 100);

            // for (var i = 0; i < this.topReferrals.length; i++) {
            //     this.topReferrals[i].percentage = ((this.topReferrals[i].AmountInUsd / this.fivePercentOfTotalAmountInvested) * 100);
            //     if (this.topReferrals[i].percentage > 100) {
            //         this.topReferrals[i].percentage = 100;
            //     }
            //     this.topReferrals[i].AmountInUsd = this.validations.toCommas(this.topReferrals[i].AmountInUsd.toFixed(3));
            // }

            if (this.topReferrals.length == 0) {
              this.noTopAffilliates = true;
            } else {
              this.noTopAffilliates = false;
            }
          }
        },
        (err) => {
          this.topRefersLoader = false;

          let obj
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);

          if (obj.code == 400) {
            this.noTopAffilliates = true;
          }

          if (obj.code == 401) {
            localStorage.clear();
            this.router.navigate(['/']);
          }
        }
      );
  }

  earningValues(value) {
    if (value == 'usdt') {
      return this.totalEarningInUSD != undefined ? this.totalEarningInUSD : 0;
    } else {
      return this.totalEarningInEMYA != undefined ? this.totalEarningInEMYA : 0;
    }
  }

  getTopAffiliates() {
    this._affilliateService
      .getMyAffiliates(
        this.userObject.UserId,
        this.myAffiliatesPageNumber,
        this.myAffiliatesPageSize
      )
      .subscribe(
        (a) => {
          console.log(a);

          if (a.code == 200) {
            this.myAffilliates = a.data.list;
            this.totalAffiliatesForUser = a.data.count;

            if (this.myAffilliates.length == 0) {
              this.noMyAffilliates = true;
            } else {
              this.noMyAffilliates = false;
            }
          }
        },
        (err) => {
          let obj
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);

          if (obj.code == 400) {
            this.noMyAffilliates = true;
          }
          if (obj.code == 401) {
            localStorage.clear();
            this.router.navigate(['/']);
          }
        }
      );
  }

  cpaActionClick() {
    this.affiliateLink = this.userObject.CpaUrl;
  }

  revenueActionClick() {
    this.affiliateLink = this.userObject.RevenueUrl;
  }

  copyToClipboard(id) {
    /* Get the text field */
    const copyText = document.getElementById(id) as HTMLInputElement;

    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand('Copy');
  }
}
