import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
export class Affiliate implements OnInit {
  // User data
  public userObject: any;
  public affiliateLink: string;
  public affiliateCode: string;
  private validations: Validations;

  // Affiliate data
  public totalEarningInUSD: number;
  public totalEarningSoFar: number;
  public totalInvestment: number = 0;
  public userInvestment: number = 0;
  public affiliatesInvestment: number = 0;
  public affiliateLevelUnlocked: number = 0;
  public totalAffiliateEarningsRecords: number;
  public totalAffiliatesArray: any[] = [];
  public referalLicencesCount = { gpa: 0, other: 0 };
  public networkIssuedPPTL: number = 0;
  public csvData: any[] = [];
  public withdrawalData: any[] = [];

  // Pagination
  public affiliateEarningsPageSize = 5;
  public affiliateEarningsPageNumber = 1;
  public totalAffiliateCurrentPage = 1;
  public withdrawCurrentPage = 0;
  public withdrawSize = 10;
  public withdrawalCount = 0;
  public itemsPerPage = 5;

  // Loaders
  public tableLoader1: boolean;
  public withdrawalLoader: boolean;
  public affiliatesLoader: boolean;
  public graphLoader: boolean;

  // Data states
  public noAffiliateEarners = false;
  public noGraphData = false;
  public dataFilter = 'DAY';

  // Referral data
  public allReferralData: { [key: number]: any } = {};
  public paginatedReferralData: { [key: number]: any[] } = {};
  public activeReferralLevels: number[] = [];
  public currentPages: { [key: number]: number } = {};

  // Chart data
  public lineChartData: Array<any> = [{ data: [], label: 'Series A' }];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true,
    legend: { display: false },
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
          gridLines: { color: 'transparent', borderDash: [8, 4] },
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
      custom: (tooltip) => tooltip && (tooltip.displayColors = false),
      callbacks: {
        label: (tooltipItem) => `${tooltipItem.xLabel} :${tooltipItem.yLabel}`,
        title: () => ''
      },
      titleFontFamily: 'LatoWebBold',
      bodyFontFamily: 'LatoWebLight',
      titleFontColor: '#0066ff'
    },
    elements: {
      line: { tension: 0 },
      point: { radius: 0 }
    }
  };
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(74,193,180,0.2)',
      borderColor: '#643E8D'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  constructor(
    public router: Router,
    public _affilliateService: AffilliateService,
    public _sharedService: SharedService,
    private modalService: NgbModal
  ) {
    this.validations = new Validations();
  }

  ngOnInit() {
    this.initializeComponent();
    this.setupEventListeners();
  }

  private initializeComponent() {
    window.scrollTo(0, 0);
    this.userObject = JSON.parse(localStorage.getItem('userObject'));
    this.affiliateLink = this.userObject.AffiliateLink;
    this.affiliateCode = this.affiliateLink.substr(
      this.affiliateLink.lastIndexOf('/') + 1
    );

    this.affiliateGraph();
    this.getAffiliateEarnings(this.affiliateEarningsPageNumber);
    this.getWithdrawalHistory();
    this.fetchReferralLevels();

    $('.list-unstyled li').removeClass('active');
    $('#aff-nav').addClass('active');
  }

  private setupEventListeners() {
    $('.accordion').click(function () {
      $('.faq-main-2 .fas').removeClass('fa-minus').addClass('fa-plus');
      if ($(this).hasClass('active')) {
        $(this).removeClass('active').next().removeClass('show');
        $('.faq-main-2 .fas').removeClass('fa-minus').addClass('fa-plus');
      } else {
        $('.accordion').removeClass('active');
        $('.panel').removeClass('show');
        $(this).find('.fas').removeClass('fa-plus').addClass('fa-minus');
        $(this).addClass('active').next().addClass('show');
      }
    });

    $('.affiliate-graph-ul > li').click(function () {
      $('.affiliate-graph-ul li').removeClass('affiliate-active-li');
      $(this).addClass('affiliate-active-li');
    });
  }

  getGraphByFilter(elem: string) {
    this.dataFilter = elem;
    this.affiliateGraph();
  }

  openWithdrawModal() {
    const modalRef = this.modalService.open(WithdrawModalComponent);
    modalRef.componentInstance.totalEarningInUSD = this.totalEarningInUSD;
    modalRef.result.then(
      (result) => {
        if (result === 'confirm') {
          window.location.reload();
        }
      },
      (reason) => {
        console.log('Withdraw dismissed');
      }
    );
  }

  changePageNumber(event: number) {
    this.affiliateEarningsPageNumber = event;
    this.getAffiliateEarnings(this.affiliateEarningsPageNumber);
  }

  changePageForWithdrawals(page: number) {
    this.withdrawCurrentPage = page;
    this.getWithdrawalHistory();
  }

  async getWithdrawalHistory() {
    this.withdrawalLoader = true;
    try {
      const response = await this._affilliateService
        .getWithdrawalHistory(this.withdrawCurrentPage, this.withdrawSize)
        .toPromise();

      if (response) {
        this.withdrawalData = response['data'].withdrawalHistory;
        this.withdrawalCount = response['data'].totalCount;
      }
    } catch (err) {
      let obj;
      if (err._body) {
        obj = JSON.parse(err._body);
      }
      console.log(obj);
    } finally {
      this.withdrawalLoader = false;
    }
  }

  async fetchReferralLevels() {
    try {
      this.tableLoader1 = true;
      const response = await this._affilliateService
        .levelReferrals(this.userObject.UserId)
        .toPromise();

      if (response && response.data && response.data.levelWiseReferrals) {
        this.allReferralData = response.data.levelWiseReferrals;
        this.paginatedReferralData = {};
        this.currentPages = {};

        // Sort levels in ascending order
        const levels = Object.keys(this.allReferralData)
          .map((level) => parseInt(level))
          .sort((a, b) => a - b);

        this.activeReferralLevels = levels;

        // Initialize pagination for each level
        levels.forEach((level) => {
          this.currentPages[level] = 1;
          this.paginateLevelData(level);
        });
      }
    } catch (error) {
      console.error('Error fetching referral levels:', error);
    } finally {
      this.tableLoader1 = false;
    }
  }

  paginateLevelData(level: number) {
    if (
      !(this.allReferralData[level] && this.allReferralData[level].referrals)
    ) {
      this.paginatedReferralData[level] = [];
      return;
    }

    const levelData = this.allReferralData[level].referrals;
    const startIndex = (this.currentPages[level] - 1) * this.itemsPerPage;
    this.paginatedReferralData[level] = levelData.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  changeLevelPage(level: number, newPage: number) {
    if (this.currentPages[level] === newPage) return;
    this.currentPages[level] = newPage;
    this.paginateLevelData(level);
  }

  getPageNumbers(totalCount: number, pageSize: number): number[] {
    if (!totalCount || !pageSize) return [];
    const totalPages = Math.ceil(totalCount / pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
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

  async getAffiliateEarnings(pageNumber: number) {
    this.affiliatesLoader = true;
    this._sharedService.showHideLoader(true);

    try {
      const response = await this._affilliateService
        .getAffiliateEarnings(
          this.userObject.UserId,
          pageNumber,
          this.affiliateEarningsPageSize
        )
        .toPromise();

      if (response && (response.code == 200 || response.code == 304)) {
        this.noAffiliateEarners = false;
        this.totalAffiliateEarningsRecords = response.data.count;
        this.totalEarningInUSD = response.data.totalEarningInUSDT;
        this.totalEarningSoFar = response.data.totalEarningSoFar;
        this.totalInvestment = response.data.totalInvestment;
        this.userInvestment = response.data.userInvestment;
        this.affiliatesInvestment = response.data.affiliatesInvestment;
        this.affiliateLevelUnlocked = response.data.affiliateLevelUnlocked;
        this.affiliateLevelUnlocked =
          this.affiliateLevelUnlocked == 0
            ? this.affiliateLevelUnlocked
            : this.affiliateLevelUnlocked - 3;
        this.totalAffiliatesArray = response.data.earningList;
        this.referalLicencesCount = {
          gpa: response.data.referralLicencesCount['gpa'],
          other: response.data.referralLicencesCount['other']
        };
        this.networkIssuedPPTL = response.data.referralIssuedPptls;
      } else {
        this.noAffiliateEarners = true;
      }
    } catch (err) {
      let obj;
      if (err._body) {
        obj = JSON.parse(err._body);
      }
      console.log(obj);
      if (obj && obj.code == 400) {
        this.noAffiliateEarners = true;
      }
      if (obj && obj.code == 401) {
        localStorage.clear();
        this.router.navigate(['/']);
      }
    } finally {
      this.affiliatesLoader = false;
      this._sharedService.showHideLoader(false);
    }
  }

  ConvertToCSV(objArray: any[]): string {
    const array =
      typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
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
          const parsedResponse = this.ConvertToCSV(this.csvData);
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

  earningValues(value: string): number {
    if (value == 'usdt') {
      return this.totalEarningInUSD != undefined ? this.totalEarningInUSD : 0;
    }
    return 0;
  }

  cpaActionClick() {
    this.affiliateLink = this.userObject.CpaUrl;
  }

  revenueActionClick() {
    this.affiliateLink = this.userObject.RevenueUrl;
  }

  copyToClipboard(id: string) {
    const copyText = document.getElementById(id) as HTMLInputElement;
    copyText.select();
    document.execCommand('Copy');
  }

  linkForTransaction(hash: string, chain: string): string {
    const chainMap: { [key: string]: string } = {
      'bsc-mainnet': 'https://bscscan.com/tx/',
      'ethereum-mainnet': 'https://etherscan.io/tx/',
      'bsc-testnet': 'https://testnet.bscscan.com/tx/',
      'ethereum-sepolia': 'https://sepolia.etherscan.io/tx/'
    };
    return chainMap[chain] ? chainMap[chain] + hash : '';
  }
}
