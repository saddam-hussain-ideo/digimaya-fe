import { Component, OnInit } from '@angular/core';
declare var $: any;
import { Router } from '@angular/router';

@Component({
  selector: 'disclaimer-and-agreement',
  templateUrl: './disclaimer-and-agreement.component.html',
  styleUrls: [
    './disclaimer-and-agreement.component.scss',
    '../landing/landing.component.scss'
  ]
})
export class DisclaimerAgreementComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }
  gotoLanding() {
    this.router.navigate(['/landing']);
  }
}
