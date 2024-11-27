import { Component } from '@angular/core';
import { WalletServices } from '../../services/walletServices';
import { SharedService } from '../../services/shared';
declare var $: any;

@Component({
  selector: 'wire-transfer',
  providers: [WalletServices],
  styleUrls: ['wire-transfer.component.scss'],
  templateUrl: 'wire-transfer.component.html',
})
export class WireTransferComponent {
  public userObject: any;
  public claims = [];
  public receiptImg: any;
  public noRecords = false;
  public pageSize: any = 10;
  public pageNumber: any = 1;
  public totalCount: any;
  public sortToAsc = true;

  constructor(
    public _walletServices: WalletServices,
    public _sharedService: SharedService
  ) {}

  public ngOnInit() {
    $('.list-unstyled li').removeClass('active');
    $('#wire-nav').addClass('active');

    this.userObject = JSON.parse(localStorage.getItem('userObject'));

    this.getClaimsList(this.pageNumber);
  }

  changePage() {
    this.getClaimsList(this.pageNumber);
  }

  sort() {
    const self = this;
    if (self.sortToAsc) {
      self.claims.sort(function (a, b) {
        const x = a.Status.toLowerCase();
        const y = b.Status.toLowerCase();
        if (x < y) {
          return -1;
        }
        if (x > y) {
          return 1;
        }
        self.sortToAsc = !self.sortToAsc;
        return 0;
      });
    } else {
      self.claims.sort(function (a, b) {
        const x = a.Status.toLowerCase();
        const y = b.Status.toLowerCase();
        if (x > y) {
          return -1;
        }
        if (x < y) {
          return 1;
        }
        self.sortToAsc = !self.sortToAsc;
        return 0;
      });
    }
  }

  getClaimsList(pageNumber) {
    this._sharedService.showHideLoader(true);
    this._walletServices
      .getClaimsList(this.userObject.UserId, pageNumber, this.pageSize)
      .subscribe(
        (a) => {
          if (a.code == 200) {
            this.claims = a.data.list;
            this.totalCount = a.data.wiredetailscount;

            if (a.data.length == 0) {
              this.noRecords = true;
            } else {
              this.noRecords = false;
            }

            this._sharedService.showHideLoader(false);
          }
        },
        (err) => {
          const obj = JSON.parse(err._body);
          this._sharedService.showHideLoader(false);
          if (obj.code == 400) {
            this.noRecords = true;
          }
        }
      );
  }

  openModalWithImage(imageUrl) {
    this.receiptImg = imageUrl;
    $('#image-modal').modal('show');
  }

  closeModal() {
    this.receiptImg = undefined;
    $('#image-modal').modal('hide');
  }

  printPage() {
    window.print();
  }
}
