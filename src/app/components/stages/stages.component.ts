import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'crypto-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss']
})
export class StagesComponent implements OnInit {
  @Input() modalData: {
    primaryText: {
      startingtext: string,
      value: string,
      bonus: string,
      bonus0: string,
      bonus1: string,
      bonus2: string,
      bonus3: string,
      bonus4: string,
      bonus5: string,
    },
    secondaryText: { showButton: boolean, buttonText: string}, 
    modalContent: string
  };
  @Output() emitUserOp = new EventEmitter<{ opStatus: string }>();
  
  constructor(private _activeModal: NgbActiveModal ) { }

  ngOnInit() {    
  }
  public emitUserApprovalStatus() {
    this.emitUserOp.emit({ opStatus: 'confirmed' });
    this._activeModal.dismiss();
  }

  dismissModal() {
    this._activeModal.dismiss()
  }

}
