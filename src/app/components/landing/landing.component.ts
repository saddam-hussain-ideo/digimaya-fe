import { Component, OnInit } from '@angular/core';
declare var $: any;
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'no-content',
  styleUrls: ['landing.component.scss'],
  templateUrl: 'landing.component.html'
})
export class LandingPageComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}
  gotoSignin() {
    this.router.navigate(['/sign-in']);
  }
  routeToSignUp() {
    this.router.navigate(['/sign-up']);
  }
  routeToCookiePolicy() {
    this.router.navigate(['/cookie-policy']);
  }
}
