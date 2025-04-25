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
  cpaAffiliates = [];
  totalInvestment: number = 0;
  userInvestment: number = 0;
  affiliatesInvestment: number = 0;
  affiliateLevelUnlocked: number = 0;
  cpaTotalCount: number = 0;
  public csvData: any;
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

  public maxLevel = 9; // Maximum possible levels
  public activeReferralLevels: number[] = []; // Stores levels that have referrals
  public referralLevelData: { [key: number]: any } = {}; // Stores data for each level
  public levelLoaders: { [key: number]: boolean } = {}; // Stores loader state for each level
  public levelPagination: { [key: number]: any } = {}; // Stores pagination info for each level

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

    this.fetchReferralLevels();

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

  async fetchReferralLevels() {
    // Start with level 1
    await this.fetchNextLevel(1);
  }

  private async fetchNextLevel(level: number) {
    this.levelLoaders[level] = true;

    try {
      const currentPage = this.levelPagination[level]
        ? this.levelPagination[level].currentPage
        : 1;
      const pageSize = this.levelPagination[level]
        ? this.levelPagination[level].pageSize
        : 5;

      const response = await this._affilliateService
        .levelReferrals(this.userObject.UserId, level, currentPage, pageSize)
        .toPromise();

      if (
        response &&
        response.data.referrals &&
        response.data.referrals.length > 0
      ) {
        // Store the level data
        this.referralLevelData[level] = response.data.referrals;

        // Store pagination info
        this.levelPagination[level] = {
          currentPage: response.data.currentPage,
          pageSize: response.data.pageSize,
          totalCount: response.data.totalReferrals
        };

        // Add to active levels if not already present
        if (!this.activeReferralLevels.includes(level)) {
          this.activeReferralLevels.push(level);
          this.activeReferralLevels.sort((a, b) => a - b);
        }

        this.levelLoaders[level] = false;

        // Fetch next level
        await this.fetchNextLevel(level + 1);
      } else {
        // If no referrals found for this level, we stop fetching
        console.log(`No referrals found for level ${level}, stopping fetch`);
      }
    } catch (error) {
      console.error(`Error fetching level ${level}:`, error);
    } finally {
      this.levelLoaders[level] = false;
    }
  }

  // Method to handle pagination for any level
  changeLevelPage(level: number, newPage: number) {
    this.levelPagination[level].currentPage = newPage;
    this._affilliateService
      .levelReferrals(
        this.userObject.UserId,
        level,
        newPage,
        this.levelPagination[level].pageSize
      )
      .subscribe(
        (res) => {
          if (res && res.data) {
            this.referralLevelData[level] = res.data.referrals;
            this.levelPagination[level] = {
              currentPage: res.data.currentPage,
              pageSize: res.data.pageSize,
              totalCount: res.data.totalReferrals
            };
          }
        },
        (error) => {
          console.error(
            `Error fetching level ${level} page ${newPage}:`,
            error
          );
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
            this.totalEarningInUSD = a.data.totalEarningInUSDT;
            this.totalEarningSoFar = a.data.totalEarningSoFar;
            this.totalInvestment = a.data.totalInvestment;
            this.userInvestment = a.data.userInvestment;
            this.affiliatesInvestment = a.data.affiliatesInvestment;
            this.affiliateLevelUnlocked = a.data.affiliateLevelUnlocked;
            this.affiliateLevelUnlocked =
              this.affiliateLevelUnlocked == 0
                ? this.affiliateLevelUnlocked
                : this.affiliateLevelUnlocked - 3;
            this.totalAffiliatesArray = a.data.earningList;
            this.referalLicencesCount = {
              gpa: a.data.referralLicencesCount['gpa'],
              other: a.data.referralLicencesCount['other']
            };
            this.networkIssuedPPTL = a.data.referralIssuedPptls;
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

  // getAffiliateInvestments() {
  //   this._affilliateService
  //     .getAffiliateInvestments(this.userObject.UserId)
  //     .subscribe(
  //       (a) => {
  //         if (a.code == 200 || a.code == 304) {
  //           this.cpaAffiliates = a.data.data;
  //           this.cpaTotalCount = a.data.totalCount;
  //           this.totalInvestment = parseFloat(
  //             Number(a.data.totalInvestment).toFixed(8)
  //           );
  //         }
  //       },
  //       (err) => {
  //         let obj;
  //         if (err._body) {
  //           obj = JSON.parse(err._body);
  //         }
  //         console.log(obj);
  //         if (obj.code == 401) {
  //           localStorage.clear();
  //           this.router.navigate(['/']);
  //         }
  //       }
  //     );
  // }

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
