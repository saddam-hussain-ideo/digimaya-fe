import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import Chart from 'chart.js';
import { DashboardService } from '../../services/dashboardService';
import { AmountInvestedModel } from '../../models/amountInvestedModel';
import { RatesModel } from '../../models/ratesModel';
import { SharedService } from '../../services/shared';
import { TransactionsModel } from '../../models/transactionsModel';
import { ActivatedRoute, Router } from '@angular/router';
import "rxjs/add/operator/takeWhile";
import { BlogModel } from '../../models/blogModel';



import 'chart.piecelabel.js';
import { Validations } from '../../validations';
import { UserService } from 'src/app/services/userService';
import { ToasterConfig, ToasterService } from 'angular2-toaster';
import { element } from '@angular/core/src/render3/instructions';
import { TranslateService } from '@ngx-translate/core';



declare var $: any;
@Component({
    selector: 'crypto-dashboard',
    providers: [DashboardService],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy, OnInit {
    public pieChartOptions: any;
    valid = false;
    userToken : string;
    userId;
    date;
    piptleIssued = 0;
    purchaseValue = 0;
    totalPiptles = 0;
    public config: ToasterConfig =
    new ToasterConfig({ animation: 'flyRight' });
    public ctx: any;
    public ctx2: any;
    public ctx3: any;
    public ctx4: any;
    public ctx5: any;
    public ctx6: any;
    public ctx7: any;
    public ctx8: any;
    bonusPercentage : number = 0;
    bonusCoins : number = 0;
    // public ctx9: any;

    public exchangeRate: any;

    public Blogs: BlogModel[];

    private _alive: boolean = true;

    public stageData = [];
    public totalCapacity = ''
    public totalIssued = ''


    public userObject: any;
    public investedValues: AmountInvestedModel;
    public recentTransactions: TransactionsModel[];
    public RatesModel: RatesModel;
    public liveRates: any;
    public selectedCurrency: any = 'btc';
    public coinsWanted: any;
    public coinsCalculated: any;
    public coinsCalculatedBottom: any = 0;
    public coinsWantedBottom: any = 0;
    public totalCoinToPayFor: any = 0;
    public recentTransactionsPNumber: any = 0;
    public totalCalulatedValue = 0;

    public recentTransactionsPSize: any = 6;
    public paginationNumber: any = 1;
    public noTransactions: boolean = false;

    public validations: Validations;

    public BitcoinWidgetData = [];
    public LiteCoinnWidgetData = [];
    public EthereumWidgetData = [];
    public MXNWidgetData = [];
    // public MXNPWidgetData = [];
    public DashWidgetData = [];
    public BitcoinCashWidgetData = [];
    public NeoWidgetData = [];
    public BitcoinGoldWidgetData = [];
    public XchangeWidgetData = [];

    public selectedCurrencyActual: any = 'btc';

    public noLatestTransactions: boolean = false;

    public bonusTokens: any = 0;

    public totalTokensWithoutBonus: any = 0;


    public count: any = 0;

    public currentPage = 1;



    public pagination = [];

    public topScrollValue = 0;


    constructor(
        public router: Router,
        public _dashboardService: DashboardService,
        public _sharedService: SharedService,
        private ref: ChangeDetectorRef,
        private _ngZone: NgZone,
        private userService: UserService,
        private toasterService: ToasterService,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService
    ) {

        this.investedValues = new AmountInvestedModel();
        this.RatesModel = new RatesModel();
        this.validations = new Validations();

    }



    // Doughnut
    public doughnutChartLabels: string[] = ['ETH', 'BTC', 'LTC', 'USD', 'AUD', 'BCH'];
    public doughnutChartData: number[] = [0, 0, 0, 0, 0, 0];
    public options: any;
    public doughnutChartType: string = 'doughnut';
    public chartColors: Array<any> = [
        {
            backgroundColor: ['#191919', '#FF8C00', '#B7B6BC', '#34519D', '#00694B', '#62c7be']
        }
    ]

    // events
    public chartClicked(e: any): void {

    }

    public chartHovered(e: any): void {

    }


    getAmountInvested() {
        this._sharedService.showHideLoader(true);
        this._dashboardService.getAmountInvested(this.userObject.UserId).takeWhile(() => this._alive).subscribe(a => {

            if (a.code == 200) {
                this.investedValues = a.data;                
                this.investedValues.TokenBalance = this.validations.toCommas(this.investedValues.TokenBalance);
                this.investedValues.EARNTokenBalance = this.validations.toCommas(this.investedValues.EARNTokenBalance);

                this._sharedService.showHideLoader(false);
                this._sharedService.saveInvestedValues(this.investedValues);
            }
        }, err => {
            var obj = JSON.parse(err._body)
            if (obj.code == 401) {
                localStorage.clear();
                this.router.navigate(['/']);
            }
        })


    }


    getLiveRatesByCode() {

        // this.liveRates.btc = (this.liveRates.btc / this.liveRates.fru).toFixed(4);
        this.liveRates.btc = Number(this.liveRates.btc).toFixed(4)
        this.liveRates.btc = this.validations.toCommas(this.liveRates.btc);

        this.liveRates.bch = Number(this.liveRates.bch).toFixed(4)
        this.liveRates.bch = this.validations.toCommas(this.liveRates.bch);

        // this.liveRates.ltc = (this.liveRates.ltc / this.liveRates.fru).toFixed(4);
        this.liveRates.ltc = Number(this.liveRates.ltc).toFixed(4)
        this.liveRates.ltc = this.validations.toCommas(this.liveRates.ltc);
        // this.liveRates.eth = (this.liveRates.eth / this.liveRates.fru).toFixed(4);
        this.liveRates.eth = Number(this.liveRates.eth).toFixed(4)
        this.liveRates.eth = this.validations.toCommas(this.liveRates.eth);
        // this.liveRates.mxn = (this.liveRates.mxn / this.liveRates.fru).toFixed(4);
        this.liveRates.mxn = Number(this.liveRates.mxn).toFixed(4)
        this.liveRates.mxn = this.validations.toCommas(this.liveRates.mxn);

        this.liveRates.usd = Number(this.liveRates.usd).toFixed(4)
        this.liveRates.usd = this.validations.toCommas(this.liveRates.usd);

    }

    getRates() {

        this._dashboardService.getRates().subscribe(a => {                    
            if (a.code == 200) {
                this.RatesModel = a.data;
                this.liveRates = Object.assign({}, a.data);                
                this.getLiveRatesByCode()
                this.populateWidgets();
            }

        }, err => {
            var obj = JSON.parse(err._body)
            if (obj.code == 401) {
                localStorage.clear();
                this.router.navigate(['/']);
            }
            this.populateWidgets();
        })
    }

    navigateToWallet() {
        this.router.navigate(['dashboard/my-wallet'])
    }

    getMostRecentTransactions() {
        this._dashboardService.getTransactionDetails(this.userObject.UserId, this.currentPage, this.recentTransactionsPSize).takeWhile(() => this._alive).subscribe(a => {

            if (a.code == 200) {
                this.pagination = [];
                this.recentTransactions = a.data.list;                                
                this.paginationNumber = a.data.count;


                for (var x = 0; x < this.recentTransactions.length; x++) {
                    this.recentTransactions[x].CalculatedTokens = this.validations.toCommas(this.recentTransactions[x].CalculatedTokens);
                    this.recentTransactions[x].TotalTokens = this.validations.toCommas(this.recentTransactions[x].TotalTokens);
                }

                this._sharedService.showHideLoader(false);

                if (this.recentTransactions.length == 0) {


                    this.noTransactions = true;

                } else {
                    this.noTransactions = false;
                }
            }


        }, err => {
            var obj = JSON.parse(err._body)
            if (obj.code == 401) {
                localStorage.clear();
                this.router.navigate(['/']);
            }
        })
    }

    bonus_price: any = 0;

    calculate_now(selectedCurrency) {
        let upperBonus = this.liveRates['upperBonus'];
        let lowerBonus = this.liveRates['lowerBonus']
        let valueForCurrencySelected = this.RatesModel[selectedCurrency];
        let calculateInMxn = valueForCurrencySelected * this.coinsWanted;        
        if(isNaN(calculateInMxn)){
            calculateInMxn = 0;
        }
        this.totalCalulatedValue = calculateInMxn;        
        // let coinWithDiscount = (calculateInMxn / this.RatesModel.liveRate).toFixed(8);
        let totalCoins = +(calculateInMxn / this.RatesModel.liveRate).toFixed(8);

        let bonusTokens = 0;
        let bonusPercentage = 0;
        if (calculateInMxn >= 2000 && calculateInMxn < 12500) {
            bonusTokens = +(totalCoins * lowerBonus / 100).toFixed(8)
            bonusPercentage = lowerBonus
        } else if (calculateInMxn >= 12500) {
            bonusTokens = +(totalCoins * upperBonus / 100).toFixed(8)
            bonusPercentage = upperBonus
        }
        let coinsWithBonus = totalCoins + bonusTokens;
        this.bonusCoins = bonusTokens;
        this.bonusPercentage = bonusPercentage;
        this.coinsCalculated = totalCoins.toFixed(6);
        if(isNaN(coinsWithBonus)){
            coinsWithBonus = 0;
        }      
        this.coinsCalculatedBottom = coinsWithBonus;
        // this.coinsCalculated = (calculateInMxn / this.RatesModel.baseRate).toFixed(8);

        // this.bonusTokens = (Number(coinWithDiscount) - Number(this.coinsCalculated)).toFixed(8)

        // this.totalTokensWithoutBonus = this.coinsCalculated;

        // this.coinsCalculatedBottom = coinWithDiscount;
        // this.coinsCalculated = coinWithDiscount;
        this.coinsWantedBottom = this.coinsWanted;

        // this.totalCoinToPayFor = Number(coinWithDiscount)

    }

    calculate_reverse(selectedCurrency) {


        let valueForCurrencySelected = this.RatesModel[selectedCurrency];

        this.coinsWanted = ((this.coinsCalculated * this.RatesModel.liveRate) / valueForCurrencySelected).toFixed(6);
        this.coinsCalculatedBottom = this.coinsCalculated;

        this.bonusTokens = ((this.coinsCalculated / 100) * this.RatesModel.bonus).toFixed(8);
        this.totalTokensWithoutBonus = (this.coinsCalculated - this.bonusTokens).toFixed(8)
    }

    byPasserFunction(value) {

        if (this.coinsWanted < 0) {
            this.coinsWanted = 0;
        }

        if (value.length > 8) {
            return false;
        }

        this.calculate_now(this.selectedCurrency);

    }

    changeOnClick(value){        
        this.byPasserFunction(value);
    }
    changeOnReverse(value){
        this.byPasserReverseFunction(value);
    }


    checkLengthForCoinsCalculated() {
        var fieldLength = $("#coinsCalculated").val().length;

        if (fieldLength <= 12) {
            return true;
        }
        else {
            var str = $("#coinsCalculated").val();
            str = str.substring(0, str.length - 1);
            $("#coinsCalculated").val(str);
            this.coinsCalculated = str;
            this.coinsCalculatedBottom = str;
        }
    }

    checkLength() {
        var fieldLength = $("#coinsWanted").val().length;

        if (fieldLength <= 8) {
            return true;
        }
        else {
            var str = $("#coinsWanted").val();
            str = str.substring(0, str.length - 1);
            $("#coinsWanted").val(str);
            this.coinsWanted = str;
            this.coinsWantedBottom = this.coinsWanted;
        }
    }

    navigateToBuyTokens() {
        if(this.totalCalulatedValue < 50){
            this.toasterService.pop('warning', "Minimum purchase amount should be equivalent to AUD $50");
            return
        }
        this.router.navigate(['/home/my-wallet']);
    }

    byPasserReverseFunction(value) {

        if (this.coinsCalculated < 0) {
            this.coinsCalculated = 0;
        }

        if (value.length > 8) {
            return false;
        }

        this.calculate_reverse(this.selectedCurrency);

    }


    resetCalculator() {

        this.totalTokensWithoutBonus = 0;
        this.bonusTokens = 0;
        this.coinsCalculatedBottom = 0;
        this.coinsWantedBottom = 0;
        this.bonusCoins = 0;
        this.bonusPercentage = 0;

    }

    getCurrencySelected(elem) {
        $("#coinsWanted").val('');
        $("#coinsCalculated").val('');


        /* this.coinsWanted = 0;
           this.coinsCalculated = 0; */


        
        this.selectedCurrency = elem;
        if (elem == "liveRate") {
            this.selectedCurrencyActual = "USD";

        } else {
            this.selectedCurrencyActual = elem;
            // this.selectedCurrencyActual = elem;
            if(elem == 'mxn'){
                this.selectedCurrencyActual = 'AUD'
            }
            else if(elem == 'usd'){
                this.selectedCurrencyActual = 'USDT'
            }
            else{
                this.selectedCurrencyActual = elem;
            }

        }

        this.resetCalculator()

        /* this.calculate_now(this.selectedCurrency);  */  // Calculate again when another value selected from dropdown
    }




    changePage(value) {

        this._sharedService.showHideLoader(true);
        this.currentPage = value;
        this.getMostRecentTransactions();
    }


    get24HrsGraph() {

        this._dashboardService.getLiveStats().subscribe(a => {

            
            if (a.code == 200) {
                this.piptleIssued =  a['data']['totalTokens']
                this.purchaseValue =  a['data']['tokensValueInAud']

                this._ngZone.run(() => {
                    let newarr = a.data.arr.map(element => {
                        return element.toFixed(6)
                    })                                        
                    this.doughnutChartData = newarr;
                })
            }


        }, err => {
            var obj = JSON.parse(err._body)
            if (obj.code == 401) {
                localStorage.clear();
                this.router.navigate(['/']);
            }

            if (obj.code == 400) {
                this.noLatestTransactions = true;
            }
        })

    }


    cutArrays() {
        this.BitcoinWidgetData.shift();
        this.LiteCoinnWidgetData.shift();
        this.DashWidgetData.shift();
        this.EthereumWidgetData.shift();
        this.BitcoinCashWidgetData.shift();
        this.BitcoinGoldWidgetData.shift();
        this.NeoWidgetData.shift();
        this.MXNWidgetData.shift();
        // this.MXNPWidgetData.shift();
    }

    populateWidgets() {




        this._dashboardService.getLiveStatsForWidgets().takeWhile(() => this._alive).subscribe(a => {            
            this.BitcoinWidgetData = a.BTC;
            for (var i = 0; i < this.BitcoinWidgetData.length; i++) {
                this.BitcoinWidgetData[i] = this.BitcoinWidgetData[i];
            }
            this.BitcoinCashWidgetData = a.BCH            
            this.LiteCoinnWidgetData = a.LTC;
            this.EthereumWidgetData = a.ETH;
            this.MXNWidgetData = a.MXN
            for (var i = 0; i < this.EthereumWidgetData.length; i++) {
                this.EthereumWidgetData[i] = this.EthereumWidgetData[i];
            }









            var bitcoinWidgetData = {
                point: { display: false },
                pointRadius: 0,
                labels: ["BTC", "BTC", "BTC", "BTC", "BTC", "BTC"],
                datasets: [{
                    // backgroundColor: "#95DCFA",
                    backgroundColor: "#997bb5",
                    label: false,
                    data: this.BitcoinWidgetData,
                    // borderColor: "#0FB8FA",
                    borderColor: "#643E8D",
                    borderWidth: 1,
                    fontSize: 7,
                    
                }],
            }

            var LiteCoinnWidgetData = {
                point: { display: false },
                pointRadius: 0,
                labels: ["LTC", "LTC", "LTC", "LTC", "LTC", "LTC"],
                datasets: [{
                    backgroundColor: "#997bb5",
                    label: false,
                    data: this.LiteCoinnWidgetData,
                    borderColor: "#643E8D",
                    borderWidth: 1
                }]
            }



            var BitcoinCashWidgetData = {
                point: { display: false },
                pointRadius: 0,
                labels: ["BCH", "BCH", "BCH", "BCH", "BCH", "BCH"],
                datasets: [{
                    backgroundColor: "#997bb5",
                    label: false,
                    data: this.BitcoinCashWidgetData,
                    borderColor: "#643E8D",
                    borderWidth: 1
                }]
            }


            var DashWidgetData = {
                point: { display: false },
                pointRadius: 0,
                labels: ["DASH", "DASH", "DASH", "DASH", "DASH", "DASH"],
                datasets: [{
                    backgroundColor: "#997bb5",
                    label: false,
                    data: this.DashWidgetData,
                    borderColor: "#643E8D",
                    borderWidth: 1
                }]
            }

            var EthereumWidgetData = {
                point: { display: false },
                pointRadius: 0,
                labels: ["ETH", "ETH", "ETH", "ETH", "ETH", "ETH"],
                datasets: [{
                    backgroundColor: "#997bb5",
                    label: false,
                    data: this.EthereumWidgetData,
                    borderColor: "#643E8D",
                    borderWidth: 1
                }]
            }

            var MXNWidgetData = {
                point: { display: false },
                pointRadius: 0,
                labels: ["MXN", "MXN", "MXN", "MXN", "MXN", "MXN"],
                datasets: [{
                    backgroundColor: "#997bb5",
                    label: false,
                    data: this.MXNWidgetData,
                    borderColor: "#643E8D",
                    borderWidth: 1
                }]
            }

            this.ref.detectChanges()

            // var MXNPWidgetData = {
            //     point: { display: false },
            //     pointRadius: 0,
            //     labels: ["MXNP", "MXNP", "MXNP", "MXNP", "MXNP", "MXNP"],
            //     datasets: [{
            //         backgroundColor: "#95DCFA",
            //         label: false,
            //         data: this.MXNPWidgetData,
            //         borderColor: "#0FB8FA",
            //         borderWidth: 1
            //     }]
            // }




            /*    var NeoWidgetData = {
                   point: { display: false },
                   pointRadius: 0,
                   labels: ["NEO", "NEO", "NEO", "NEO", "NEO", "NEO"],
                   datasets: [{
                       backgroundColor: "#95DCFA",
                       label: false,
                       data: this.NeoWidgetData,
                       borderColor: "#0FB8FA",
                       borderWidth: 1
                   }]
               }
        */
            var BitcoinGoldWidgetData = {
                point: { display: false },
                pointRadius: 0,
                labels: ["BTG", "BTG", "BTG", "BTG", "BTG", "BTG"],
                datasets: [{
                    backgroundColor: "#95DCFA",
                    label: false,
                    data: this.BitcoinGoldWidgetData,
                    borderColor: "#0FB8FA",
                    borderWidth: 1
                }]
            }

            var XchangeWidgetData = {
                point: { display: false },
                pointRadius: 0,
                labels: ["FRU", "FRU", "FRU", "FRU", "FRU", "FRU"],
                datasets: [{
                    backgroundColor: "#95DCFA",
                    label: false,
                    data: this.XchangeWidgetData,
                    borderColor: "#0FB8FA",
                    borderWidth: 1
                }]
            }




            $(window).scroll(function (event) {
                var scroll = $(window).scrollTop();
                this.topScrollValue = scroll;

            });

            var self = this;
            self.topScrollValue = $(window).scrollTop();

            var arr = [];
            var graphWidgetOptions = {





                gridLines: false,
                responsive: true,
                legend: {
                    display: false
                },
                tooltips: {
                    // Disable the on-canvas tooltip


                    enabled: false,
                    yAlign: 'bottom',
                    callbacks: {
                        title: function () { }
                    },
                    custom: function (tooltipModel) {
                        // Tooltip Element



                        var tooltipEl: any = document.getElementById('chartjs-tooltip');

                        // Create element on first render
                        if (!tooltipEl) {
                            tooltipEl = document.createElement('div');
                            tooltipEl.id = 'chartjs-tooltip';
                            tooltipEl.innerHTML = "<table></table>";
                            document.body.appendChild(tooltipEl);
                        }

                        // Hide if no tooltip
                        if (tooltipModel.opacity === 0) {
                            tooltipEl.style.opacity = 0;
                            return;
                        }

                        // Set caret Position
                        tooltipEl.classList.remove('above', 'below', 'no-transform');
                        if (tooltipModel.yAlign) {
                            tooltipEl.classList.add(tooltipModel.yAlign);
                        } else {
                            tooltipEl.classList.add('no-transform');
                        }

                        function getBody(bodyItem) {
                            return bodyItem.lines;
                        }

                        // Set Text
                        if (tooltipModel.body) {
                            var titleLines = tooltipModel.title || [];
                            var bodyLines = tooltipModel.body.map(getBody);

                            var innerHtml = '<thead>';

                            titleLines.forEach(function (title) {
                                innerHtml += '<tr><th>' + title + '</th></tr>';
                            });
                            innerHtml += '</thead><tbody>';

                            bodyLines.forEach(function (body, i) {
                                var colors = tooltipModel.labelColors[i];
                                var style = 'background:' + colors.backgroundColor;
                                style += '; border-color:' + colors.borderColor;
                                style += '; border-width: 2px';
                                var span = '<span style="' + style + '"></span>';
                                innerHtml += '<tr><td>' + span + body + '</td></tr>';
                            });
                            innerHtml += '</tbody>';

                            var tableRoot = tooltipEl.querySelector('table');
                            tableRoot.style.position = "relative";

                            tableRoot.innerHTML = innerHtml;
                        }

                        // `this` will be the overall tooltip
                        /*  var position = this._chart.canvas.getBoundingClientRect(); */


                        var canvas = this._chart.canvas;

                        var id = $(canvas).attr('id')
                        var graphPlacement = $("#" + id).offset();
                        var canvasContainer = $(canvas).parent();
                        var x = canvasContainer.position();


                        // Display, position, and set styles for font



                        tooltipEl.style.opacity = 1;
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.left = graphPlacement.left + 30 + "px";
                        tooltipEl.style.top = graphPlacement.top + 30 + "px";
                        /*   tooltipEl.style.left = position.left + tooltipModel.caretX + 'px';
                          tooltipEl.style.top = position.top + self.topScrollValue + tooltipModel.caretY + 'px'; */
                        tooltipEl.style.fontFamily = 'LatoWebBold';
                        tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                        tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                        tooltipEl.style.color = "#2097d4";
                        tooltipEl.style.background = "white";
                        tooltipEl.style.borderRadius = "4px";
                        tooltipEl.style.boxShadow = "4px 4px 4px #ccc";
                        tooltipEl.style.zIndex = "600";
                        tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    }
                },
                chartArea: {
                    backgroundColor: 'red'
                },

                label: {
                    display: false
                },
                scales: {
                    yAxes: [{

                        gridLines: {
                            color: "transparent",
                        },

                        ticks: {
                            display: false,

                        }
                    }],

                    xAxes: [{
                        display: false,
                        gridLines: {
                            color: "transparent",
                            display: false
                        },

                        ticks: {
                            display: false,


                        }
                    }]
                }
            }







            /*  this.exchangeRate = document.getElementById("exchangeRate"); */
            this.ctx = document.getElementById("myChart");
            this.ctx2 = document.getElementById("myChart2");
            this.ctx3 = document.getElementById("myChart3");
            // this.ctx4 = document.getElementById("myChart4");
            this.ctx5 = document.getElementById("myChart5");
            this.ctx8 = document.getElementById("myChart8");
            // this.ctx9 = document.getElementById("myChart9");
            // this.ctx6 = document.getElementById("myChart6");
            // this.ctx7 = document.getElementById("myChart7");


            /*   var myChart = new Chart(this.exchangeRate, {
                  type: 'line',
                  lineColor: "#0FB8FA",
                  data: XchangeWidgetData,
                  options: graphWidgetOptions
              }); */


            var myChart = new Chart(this.ctx, {
                type: 'line',
                lineColor: "#0FB8FA",
                data: bitcoinWidgetData,
                options: graphWidgetOptions
            });

            var myChart = new Chart(this.ctx2, {
                type: 'line',
                lineColor: "#0FB8FA",
                data: LiteCoinnWidgetData,
                options: graphWidgetOptions
            });


            var myChart = new Chart(this.ctx3, {
                type: 'line',
                lineColor: "#0FB8FA",
                data: BitcoinCashWidgetData,
                options: graphWidgetOptions,
                
            });

            // var myChart = new Chart(this.ctx4, {
            //     type: 'line',
            //     lineColor: "#0FB8FA",
            //     data: DashWidgetData,
            //     options: graphWidgetOptions
            // });

            var myChart = new Chart(this.ctx5, {
                type: 'line',
                lineColor: "#0FB8FA",
                data: EthereumWidgetData,
                options: graphWidgetOptions
            });

            // var myChart = new Chart(this.ctx9, {
            //     type: 'line',
            //     lineColor: "#0FB8FA",
            //     data: MXNPWidgetData,
            //     options: graphWidgetOptions
            // });

            var myChart = new Chart(this.ctx8, {
                type: 'line',
                lineColor: "#0FB8FA",
                data: MXNWidgetData,
                options: graphWidgetOptions
            });

            /*
                    var myChart = new Chart(this.ctx6, {
                        type: 'line',
                        lineColor: "#0FB8FA",
                        data: NeoWidgetData,
                        options: graphWidgetOptions
                    });
            */
            // var myChart = new Chart(this.ctx7, {
            //     type: 'line',
            //     lineColor: "#0FB8FA",
            //     data: BitcoinGoldWidgetData,
            //     options: graphWidgetOptions
            // });



        }, err => {
            var obj = JSON.parse(err._body)
            if (obj.code == 401) {
                localStorage.clear();
                this.router.navigate(['/']);
            }
        })
    }

    getBlogs() {

        this._dashboardService.getBlogs().takeWhile(() => this._alive).subscribe(a => {

            if (a.code == 200) {
                this.Blogs = a.data;
            }
        }, err => {
            var obj = JSON.parse(err._body)
            if (obj.code == 401) {
                localStorage.clear();
                this.router.navigate(['/']);
            }
        })
    }


    ngOnInit() {
        // this.userToken = JSON.parse(localStorage.getItem('userToken'));
        let userToken = this.activatedRoute.snapshot.params['id'];
        
        if(userToken){            
            this._sharedService.updateValidateLoader(true);
            this.userService.singleSignOn(userToken,true).subscribe(response => {
                if(response){
                    this._sharedService.updateValidateLoader(false);       
                    // this._sharedService.showHideLoader(true);
                    localStorage.setItem('userObject', JSON.stringify(response.data));
                    localStorage.setItem('userToken', JSON.stringify(response.data.token));
                    this.translate.use(response.data.Language)
                    this.getDashboardData();
                }  
            }, err => {
                this._sharedService.updateValidateLoader(false);
                
                let obj = JSON.parse(err._body);                
                if(obj['code']=== 401){
                    this.router.navigate(['/']);                
                } else{
                    this.router.navigate(['/']);                
                }
            })
        }
        else{
            this.getDashboardData()
        }     
    }
    getDashboardData(){ 
        this.userObject = JSON.parse(localStorage.getItem('userObject'));
        this.userToken = JSON.parse(localStorage.getItem('userToken'));
        
        if (this.userObject) {
            this.userId = this.userObject['UserId']
            this.getTokens();
        }
        this.date = new Date();

        this.getAmountInvested();
        this.getRates();
        this.getILOStages();
        this.getMostRecentTransactions();
        this.get24HrsGraph();
        this.getBlogs();
        $(".list-unstyled li").removeClass("active");
        $("#dash-nav").addClass("active");


        this.pieChartOptions = {
            segmentShowStroke: false,
            legend: { display: false },
            cutoutPercentage: '30',
            pieceLabel: {
                // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
                render: 'label',

                // precision for percentage, default is 0
                precision: 0,

                showZero: true,

                fontSize: 12,

                fontColor: '#fff',

                fontStyle: 'normal',

                fontFamily: "LatoWeb",

                arc: false,

                position: 'default',

                overlap: false,

                showActualPercentages: true,

                outsidePadding: 4,

                textMargin: 4
            },
            elements: {
                arc: {
                    borderColor: '#000',
                    borderWidth: 0
                }
            },


            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) {
                        return data['labels'][tooltipItem[0]['index']];
                    },
                    label: function (tooltipItem, data) {
                        return data['datasets'][0]['data'][tooltipItem['index']];
                    }
                },
                backgroundColor: '#FFF',
                titleFontSize: 12,
                titleFontFamily: 'LatoWebBold',
                bodyFontFamily: 'LatoWebLight',
                titleFontColor: '#0066ff',
                bodyFontColor: '#000',
                bodyFontSize: 10,
                displayColors: false
            },
            tooltipTemplate: "<%= value %>%"
        }
    }

    getTokens(){
		this.userService.getTokens(this.userId,this.userToken).subscribe(res => {      
			if (res) {
                this.totalPiptles = res['data']['totalTokens'];
			}
		}, err => {
			console.log(err);
		})		
	  }

    getILOStages() {
        this._dashboardService.getILOStages().subscribe(a => {

            if (a.code == 200) {
                this.stageData = a['data'].stagesInfo;
                this.totalCapacity = a['data'].totalCapacity;
                this.totalIssued = a['data'].totalIssued
            }

        }, err => {
            var obj = JSON.parse(err._body)
            if (obj.code == 401) {
                localStorage.clear();
                this.router.navigate(['/']);
            }
        })

    }

    ngOnDestroy() {
        this._alive = false;
    }




}
