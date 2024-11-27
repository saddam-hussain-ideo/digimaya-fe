import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

// import { Socket } from 'ng-socket-io';

@Injectable()
export class SocketService {
  constructor() {}

  ConnectSocket(msg: string) {
    // this.socket.emit("ConnectInvestorSocket", msg);
  }
  JoinInvestorRoom(msg: string) {
    // this.socket.emit("JoinInvestorRoom", msg);
  }

  getNewUser() {
    // return this.socket
    //     .fromEvent<any>("investor-new-user-affiliation")
    //     .map(data => data);
    return null;
  }
  getNewTransaction() {
    // return this.socket
    //     .fromEvent<any>("investor-new-transaction")
    //     .map(data => data);
    return null;
  }
  getNewAffiliationInvestmentTransaction() {
    // return this.socket
    //     .fromEvent<any>("investor-affiliation-investment-updation")
    //     .map(data => data)
    return null;
  }
  getKYCStatus() {
    // return this.socket
    //     .fromEvent<any>("investor-kyc-status-updation")
    //     .map(data => data)
    return null;
  }
  getICOStageUpdationUser() {
    // return this.socket
    //     .fromEvent<any>("new-stage")
    //     .map(data => data);
    return null;
  }

  getWireTransferStatus() {
    // return this.socket
    //     .fromEvent<any>("investor-wire-transfer-status")
    //     .map(data => data);
    return null;
  }
}
