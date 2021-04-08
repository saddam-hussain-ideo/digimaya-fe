import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'crypto-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  public n: number = 100;
  constructor(public router: Router) { }



  ngOnInit() {

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 3000);

  }

}
