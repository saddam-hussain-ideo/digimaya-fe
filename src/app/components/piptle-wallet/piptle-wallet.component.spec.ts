import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiptleWalletComponent } from './piptle-wallet.component';

describe('PiptleWalletComponent', () => {
  let component: PiptleWalletComponent;
  let fixture: ComponentFixture<PiptleWalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiptleWalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiptleWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
