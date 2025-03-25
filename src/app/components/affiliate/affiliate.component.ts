import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AffilliateService } from '../../services/affiliateService';
import { Validations } from '../../validations';
import { SharedService } from '../../services/shared';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WithdrawModalComponent } from '../withdraw-modal/withdraw-modal.component';

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
  public totalEarningSoFar: any;

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
  tableLoader4: boolean;
  tableLoader5: boolean;
  tableLoader6: boolean;
  tableLoader7: boolean;
  tableLoader8: boolean;
  tableLoader9: boolean;

  withdrawalLoader: boolean;
  topRefersLoader: boolean;
  affiliatesLoader: boolean;
  referralLevel: number;
  pageNo;
  pageSize;
  rowsData;

  withdrawalData;
  levelOneData;
  levelTwoData;
  levelThreeData;
  levelFourData;
  levelFiveData;
  levelSixData;
  levelSevenData;
  levelEightData;
  levelNineData;

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
  withdrawCurrentPage = 1;
  withdrawSize = 10;
  withdrawalCount = 0;

  tableOneCurrentPage = 1;
  tableOneSize = 5;
  tableOneCount = 1;

  tableTwoCurrentPage = 1;
  tableTwoSize = 5;
  tableTwoCount = 1;

  tableThreeCurrentPage = 1;
  tableThreeSize = 5;
  tableThreeCount = 1;

  tableFourCurrentPage = 1;
  tableFourSize = 5;
  tableFourCount = 1;

  tableFiveCurrentPage = 1;
  tableFiveSize = 5;
  tableFiveCount = 1;

  tableSixCurrentPage = 1;
  tableSixSize = 5;
  tableSixCount = 1;

  tableSevenCurrentPage = 1;
  tableSevenSize = 5;
  tableSevenCount = 1;

  tableEightCurrentPage = 1;
  tableEightSize = 5;
  tableEightCount = 1;

  tableNineCurrentPage = 1;
  tableNineSize = 5;
  tableNineCount = 1;

  constructor(
    public router: Router,
    public _affilliateService: AffilliateService,
    public _sharedService: SharedService,
    private modalService: NgbModal
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

  openWithdrawModal() {
    const modalRef = this.modalService.open(WithdrawModalComponent);
    modalRef.componentInstance.totalEarningInUSD = this.totalEarningInUSD;
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          // Handle the confirm action
          console.log('Withdraw confirmed');
          window.location.reload();
        }
      },
      (reason) => {
        // Handle the dismiss action
        console.log('Withdraw dismissed');
      }
    );
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
  changePageForTable4(value) {
    this.tableFourCurrentPage = value;
    this.levelFourReferrals();
  }
  changePageForTable5(value) {
    this.tableFiveCurrentPage = value;
    this.levelFiveReferrals();
  }
  changePageForTable6(value) {
    this.tableSixCurrentPage = value;
    this.levelSixReferrals();
  }
  changePageForTable7(value) {
    this.tableSevenCurrentPage = value;
    this.levelSevenReferrals();
  }
  changePageForTable8(value) {
    this.tableEightCurrentPage = value;
    this.levelEightReferrals();
  }
  changePageForTable9(value) {
    this.tableNineCurrentPage = value;
    this.levelNineReferrals();
  }
  changePageForWithdrawals(page: number) {
    this.withdrawCurrentPage = page;
    this.getWithdrawalHistory();
  }

  public ctx;

  public ngOnInit() {
    window.scrollTo(0, 0);
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

    this.getWithdrawalHistory();

    this.levelOneReferrals();
    this.levelTwoReferrals();
    this.levelThreeReferrals();

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

    $('.affiliate-graph-ul > li').click(function () {
      $('.affiliate-graph-ul li').removeClass('affiliate-active-li');
      $(this).addClass('affiliate-active-li');
    });
  }

  getWithdrawalHistory() {
    this.withdrawalLoader = true;
    this._affilliateService
      .getWithdrawalHistory(this.withdrawCurrentPage, this.withdrawSize)
      .subscribe(
        (res) => {
          if (res) {
            this.withdrawalLoader = false;
            this.withdrawalData = res['data'].withdrawalHistory;
            this.withdrawalCount = res['data'].totalCount;
          }
        },
        (err) => {
          this.withdrawalLoader = false;
          let obj;
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);
        }
      );
  }

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
          if (res) {
            this.tableLoader1 = false;
            this.referredCountries = res['data']['referred_countries'];
            this.levelOneData = res['data']['referrals'];
            this.tableOneCount = res['data']['totalReferrals'];
            this.tableOneCurrentPage = res['data']['currentPage'];
            this.tableOneSize = res['data']['pageSize'];
          }
        },
        (err) => {
          this.tableLoader1 = false;
          let obj;
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
          if (res) {
            this.tableLoader2 = false;
            this.levelTwoData = res.data.referrals;
            this.tableTwoCount = res.data.totalReferrals;
            this.tableTwoCurrentPage = res.data.currentPage;
            this.tableTwoSize = res.data.pageSize;
          }
        },
        (err) => {
          this.tableLoader2 = false;
          let obj;
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
          if (res) {
            this.tableLoader3 = false;
            this.levelThreeData = res.data.referrals;
            this.tableThreeCount = res.data.totalReferrals;
            this.tableThreeCurrentPage = res.data.currentPage;
            this.tableThreeSize = res.data.pageSize;
          }
        },
        (err) => {
          this.tableLoader3 = false;
          let obj;
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);
        }
      );
  }

  levelFourReferrals() {
    this.tableLoader4 = true;
    this._affilliateService
      .levelReferrals(
        this.userObject.UserId,
        (this.referralLevel = 4),
        this.tableFourCurrentPage,
        this.tableFourSize
      )
      .subscribe(
        (res) => {
          if (res) {
            this.tableLoader4 = false;
            this.levelFourData = res.data.referrals;
            this.tableFourCount = res.data.totalReferrals;
            this.tableFourCurrentPage = res.data.currentPage;
            this.tableFourSize = res.data.pageSize;
          }
        },
        (err) => {
          this.tableLoader4 = false;
          let obj;
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);
        }
      );
  }

  levelFiveReferrals() {
    this.tableLoader5 = true;
    this._affilliateService
      .levelReferrals(
        this.userObject.UserId,
        (this.referralLevel = 5),
        this.tableFiveCurrentPage,
        this.tableFiveSize
      )
      .subscribe(
        (res) => {
          if (res) {
            this.tableLoader5 = false;
            this.levelFiveData = res.data.referrals;
            this.tableFiveCount = res.data.totalReferrals;
            this.tableFiveCurrentPage = res.data.currentPage;
            this.tableFiveSize = res.data.pageSize;
          }
        },
        (err) => {
          this.tableLoader5 = false;
          let obj;
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);
        }
      );
  }

  levelSixReferrals() {
    this.tableLoader6 = true;
    this._affilliateService
      .levelReferrals(
        this.userObject.UserId,
        (this.referralLevel = 6),
        this.tableSixCurrentPage,
        this.tableSixSize
      )
      .subscribe(
        (res) => {
          if (res) {
            this.tableLoader6 = false;
            this.levelSixData = res.data.referrals;
            this.tableSixCount = res.data.totalReferrals;
            this.tableSixCurrentPage = res.data.currentPage;
            this.tableSixSize = res.data.pageSize;
          }
        },
        (err) => {
          this.tableLoader6 = false;
          let obj;
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);
        }
      );
  }

  levelSevenReferrals() {
    this.tableLoader7 = true;
    this._affilliateService
      .levelReferrals(
        this.userObject.UserId,
        (this.referralLevel = 7),
        this.tableSevenCurrentPage,
        this.tableSevenSize
      )
      .subscribe(
        (res) => {
          if (res) {
            this.tableLoader7 = false;
            this.levelSevenData = res.data.referrals;
            this.tableSevenCount = res.data.totalReferrals;
            this.tableSevenCurrentPage = res.data.currentPage;
            this.tableSevenSize = res.data.pageSize;
          }
        },
        (err) => {
          this.tableLoader7 = false;
          let obj;
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);
        }
      );
  }

  levelEightReferrals() {
    this.tableLoader8 = true;
    this._affilliateService
      .levelReferrals(
        this.userObject.UserId,
        (this.referralLevel = 8),
        this.tableEightCurrentPage,
        this.tableEightSize
      )
      .subscribe(
        (res) => {
          if (res) {
            this.tableLoader8 = false;
            this.levelEightData = res.data.referrals;
            this.tableEightCount = res.data.totalReferrals;
            this.tableEightCurrentPage = res.data.currentPage;
            this.tableEightSize = res.data.pageSize;
          }
        },
        (err) => {
          this.tableLoader8 = false;
          let obj;
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);
        }
      );
  }

  levelNineReferrals() {
    this.tableLoader9 = true;
    this._affilliateService
      .levelReferrals(
        this.userObject.UserId,
        (this.referralLevel = 9),
        this.tableNineCurrentPage,
        this.tableNineSize
      )
      .subscribe(
        (res) => {
          if (res) {
            this.tableLoader9 = false;
            this.levelNineData = res.data.referrals;
            this.tableNineCount = res.data.totalReferrals;
            this.tableNineCurrentPage = res.data.currentPage;
            this.tableNineSize = res.data.pageSize;
          }
        },
        (err) => {
          this.tableLoader9 = false;
          let obj;
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
            this.lineChartData[0].data = a.data.values;
            this.lineChartLabels = a.data.dates;
            this.noGraphData = false;
          }
        },
        (err) => {
          this.graphLoader = false;
          let obj;
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
          this.affiliatesLoader = false;
          this._sharedService.showHideLoader(false);
          if (a.code == 200 || a.code == 304) {
            this.noAffiliateEarners = false;
            this.totalAffiliateEarningsRecords = a.data.count;
            this.totalEarningInEMYA = a.data.totalEarningInEMYA;
            this.totalEarningInUSD = a.data.totalEarningInUSDT;
            this.totalEarningSoFar = a.data.totalEarningSoFar;
            this.totalAffiliatesArray = a.data.earningList;
            this.referalLicencesCount = {
              gpa: a.data.referralLicencesCount['gpa'],
              other: a.data.referralLicencesCount['other']
            };
            this.networkIssuedPPTL = a.data.referralIssuedPptls;

            if (Number(this.totalEarningSoFar) > 6) {
              this.levelFourReferrals();
            }

            if (Number(this.totalEarningSoFar) > 12) {
              this.levelFiveReferrals();
            }

            if (Number(this.totalEarningSoFar) > 24) {
              this.levelSixReferrals();
            }

            if (Number(this.totalEarningSoFar) > 48) {
              this.levelSevenReferrals();
            }

            if (Number(this.totalEarningSoFar) > 96) {
              this.levelEightReferrals();
            }

            if (Number(this.totalEarningSoFar) > 192) {
              this.levelNineReferrals();
            }
          }
        },
        (err) => {
          this._sharedService.showHideLoader(false);
          this.affiliatesLoader = false;
          let obj;
          if (err._body) {
            obj = JSON.parse(err._body);
          }
          console.log(obj);
          if (obj.code == 400) {
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
        if (a.code == 200) {
          this.csvData = a.data.earningList;
          const jsonObject = JSON.stringify(this.csvData);
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
        let obj;
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
      .getTopReferrals(
        this.topReferalCurrentPage,
        this.referralPSize,
        this.userObject.UserId
      )
      .subscribe(
        (a) => {
          if (a.code == 200) {
            this.topRefersLoader = false;
            this.topReferrals = a.data;
            this.paginationNumber = a.data.totalRecords;
            if (this.topReferrals.length == 0) {
              this.noTopAffilliates = true;
            } else {
              this.noTopAffilliates = false;
            }
          }
        },
        (err) => {
          this.topRefersLoader = false;

          let obj;
          if (err._body) {
            obj = JSON.parse(err._body);
          }
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
          let obj;
          if (err._body) {
            obj = JSON.parse(err._body);
          }
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
    const copyText = document.getElementById(id) as HTMLInputElement;
    copyText.select();
    document.execCommand('Copy');
  }

  linkForTransaction(hash, chain) {
    console.log(hash, chain);
    if (chain === 'bsc-mainnet') {
      return `https://bscscan.com/tx/${hash}`;
    } else if (chain === 'ethereum-mainnet') {
      return `https://etherscan.io/tx/${hash}`;
    } else if (chain === 'bsc-testnet') {
      return `https://testnet.bscscan.com/tx/${hash}`;
    } else if (chain === 'ethereum-sepolia') {
      return `https://sepolia.etherscan.io/tx/${hash}`;
    }
  }

  getPageNumbers(totalCount: number, pageSize: number): number[] {
    const totalPages = Math.ceil(totalCount / pageSize);
    return Array(totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }
}
