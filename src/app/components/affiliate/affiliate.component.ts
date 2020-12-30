import {
    Component,
    OnInit
} from '@angular/core';
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
    templateUrl: './affiliate.template.html',
})

export class Affiliate {

    public userObject: any;
    public topReferrals: any;
    public affiliateLink: any;
    public affiliateCode: any;
    public myAffilliates: any;
    public noMyAffilliates: boolean = false;



    public noTopAffilliates: boolean = false;

    public validations: Validations;

    public affiliateEarningsPageSize = 5;
    public affiliateEarningsPageNumber = 1;
    public totalAffiliateEarningsRecords: any;
    public totalAffiliateCurrentPage = 1;
    public totalAffiliatesArray = [];
    public csvData: any;

    public totalEarningInCrypto: any;
    public totalEarningInUSD: any;

    public dataFilter = "DAY";
    public noGraphData: boolean = false;


    public myAffiliatesPageSize = 5;
    public myAffiliatesPageNumber = 1;
    public totalAffiliatesForUser: any;
    public myAffiliatesCurrentPage = 1;
    public graphLoader: boolean = false;

    public fivePercentOfTotalAmountInvested: any;
    public noAffiliateEarners: boolean = false;

    constructor(public router: Router, public _affilliateService: AffilliateService, public _sharedService: SharedService) {
        this.validations = new Validations();
    }


    public lineChartData: Array<any> = [
        { data: [], label: 'Series A' }

    ];
    public lineChartLabels: Array<any> = [];

    public lineChartOptions: any = {

        responsive: true,
        legend: {
            display: false
        },

        scales: {

            yAxes: [{
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

            }],

            xAxes: [{
                gridLines: {

                    color: "transparent",
                    borderDash: [8, 4]
                },
                ticks: {
                    beginAtZero: true,
                    fontColor: '#616A75',
                    fontSize: 13,
                    fontFamily: 'LatoWeb'
                }

            }]
        },

        tooltips: {
            custom: function(tooltip) {
              if (!tooltip) return;
              // disable displaying the color box;
              tooltip.displayColors = false
            },
            callbacks: {
              // use label callback to return the desired label
              label: function(tooltipItem, data) {
                return tooltipItem.xLabel + " :" + tooltipItem.yLabel;
              },
              // remove title
              title: function(tooltipItem, data) {
                return;
              }
            },
            titleFontFamily: 'LatoWebBold',
            bodyFontFamily: 'LatoWebLight',
            titleFontColor: '#0066ff',
          }
        ,
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
        { // grey
            backgroundColor: 'rgba(74,193,180,0.2)',
            // borderColor: 'rgba(74,193,180,1)'
            borderColor: '#643E8D'

        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';


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



    public ctx;

    public ngOnInit() {


        this.userObject = JSON.parse(localStorage.getItem("userObject"));

        this.affiliateGraph();
        $("#test1").prop("checked", true);
        this.affiliateLink = this.userObject.AffiliateLink;
        this.affiliateCode = this.userObject.AffiliateLink.substr(this.userObject.AffiliateLink.lastIndexOf('/') + 1)

        this.getTopReferrals();
        this.getTopAffiliates();
        this.getAffiliateEarnings(this.affiliateEarningsPageNumber);
        this.affiliateGraph();
     

        

        $(".list-unstyled li").removeClass("active");
        $("#aff-nav").addClass("active");



        $('.accordion').click(function () {



            $(".faq-main-2 .fas").removeClass("fa-minus").addClass("fa-plus");

            if ($(this).hasClass('active')) {

                $(this).removeClass('active');
                $(this).next().removeClass('show');

                $(".faq-main-2 .fas").removeClass("fa-minus").addClass("fa-plus");


            } else {
                $('.accordion').removeClass('active');
                $('.panel').removeClass('show');
                $(this).find(".fas").removeClass("fa-plus").addClass("fa-minus");

                $(this).addClass('active');
                $(this).next().addClass('show');
            }

        })









        /* Graph */


        $('.affiliate-graph-ul > li').click(function () {
            $('.affiliate-graph-ul li').removeClass("affiliate-active-li");
            $(this).addClass("affiliate-active-li");
        })

    }





    affiliateGraph() {

        this.graphLoader = true;

        this._affilliateService.getAffiliatesGraph(this.userObject.UserId, this.dataFilter).subscribe(a => {

          
            if (a.code == 200) {
                this.graphLoader = false;
                this.lineChartData[0].data = a.data.values;
                this.lineChartLabels = a.data.dates;
                this.noGraphData = false;
            }

        }, err => {

            this.graphLoader = false;
            var obj = JSON.parse(err._body);
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
        this._sharedService.showHideLoader(true);
        this._affilliateService.getAffiliateEarnings(this.userObject.UserId, pageNumber, this.affiliateEarningsPageSize).subscribe(a => {

            if (a.code == 200) {
                this._sharedService.showHideLoader(false);
                this.noAffiliateEarners = false;
                this.totalAffiliateEarningsRecords = a.data.Count;
                this.totalEarningInCrypto = a.data.EarningInFru.toFixed(4);
                this.totalEarningInUSD = a.data.EarningInMexican.toFixed(4);
                this.totalAffiliatesArray = a.data.list;

            }
        }, err => {

            var obj = JSON.parse(err._body);
            if (obj.code == 400) {
                // show empty error
                this._sharedService.showHideLoader(false);
                this.noAffiliateEarners = true;
            }
            if (obj.code == 401) {
                localStorage.clear();
                this.router.navigate(['/']);
            }

        });
    }


    ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    }

    downloadCSV() {

        this._sharedService.showHideLoader(true);


        this._affilliateService.getCsvData(this.userObject.UserId).subscribe(a => {

            if (a.code == 200) {


                this.csvData = a.data.list;

                var jsonObject = JSON.stringify(this.csvData);

                // Convert JSON to CSV & Display CSV
                var parsedResponse = this.ConvertToCSV(jsonObject);

                let blob = new Blob([parsedResponse], { type: 'text/csv' });
                let url = window.URL.createObjectURL(blob);
                var d = new Date().getTime();
                if (navigator.msSaveOrOpenBlob) {

                    navigator.msSaveBlob(blob, d + '.csv');

                } else {
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = d + '.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }

                this._sharedService.showHideLoader(false);

                window.URL.revokeObjectURL(url);


            }



        }, err => {


            var obj = JSON.parse(err._body);


            if (obj.code == 400) {

                this._sharedService.showHideLoader(false);
            }

            if (obj.code == 401) {
                localStorage.clear();
                this.router.navigate(['/']);
            }

        })


    }

    getTopReferrals() {

        this._affilliateService.getTopReferrals().subscribe(a => {
            
            if (a.code == 200) {
                this.topReferrals = a.data.list;


                this.fivePercentOfTotalAmountInvested = ((a.data.totalAmountInvestedInUsd * 5) / 100);




                for (var i = 0; i < this.topReferrals.length; i++) {
                    this.topReferrals[i].percentage = ((this.topReferrals[i].AmountInUsd / this.fivePercentOfTotalAmountInvested) * 100);
                    if (this.topReferrals[i].percentage > 100) {
                        this.topReferrals[i].percentage = 100;
                    }
                    this.topReferrals[i].AmountInUsd = this.validations.toCommas(this.topReferrals[i].AmountInUsd.toFixed(3));
                }



                if (this.topReferrals.length == 0) {
                    this.noTopAffilliates = true;
                } else {
                    this.noTopAffilliates = false;
                }
            }
        }, err => {

            var obj = JSON.parse(err._body);


            if (obj.code == 400) {
                this.noTopAffilliates = true;
            }

            if (obj.code == 401) {
                localStorage.clear();
                this.router.navigate(['/']);
            }

        })
    }

    getTopAffiliates() {

        this._affilliateService.getMyAffiliates(this.userObject.UserId, this.myAffiliatesPageNumber, this.myAffiliatesPageSize).subscribe(a => {

            if (a.code == 200) {
                this.myAffilliates = a.data.list;
                this.totalAffiliatesForUser = a.data.count;

                if (this.myAffilliates.length == 0) {
                    this.noMyAffilliates = true;
                } else {
                    this.noMyAffilliates = false;
                }
            }
        }, err => {

            var obj = JSON.parse(err._body)


            if (obj.code == 400) {
                this.noMyAffilliates = true;
            }
            if (obj.code == 401) {
                localStorage.clear();
                this.router.navigate(['/']);
            }

        })
    }

    cpaActionClick() {
        this.affiliateLink = this.userObject.CpaUrl;
    }

    revenueActionClick() {

        this.affiliateLink = this.userObject.RevenueUrl;
    }


    copyToClipboard(id) {

        /* Get the text field */
        var copyText = document.getElementById(id) as HTMLInputElement;

        /* Select the text field */
        copyText.select();

        /* Copy the text inside the text field */
        document.execCommand("Copy");

    }


}


