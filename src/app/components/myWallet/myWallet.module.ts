import { NgModule } from '@angular/core';
import { MyWalletComponent } from './myWallet.component';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angular2-qrcode';
import { ToasterModule } from 'angular2-toaster';
import { TooltipModule } from 'ng2-tooltip-directive';
@NgModule({
  declarations: [MyWalletComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    QRCodeModule,
    ToasterModule,
    TooltipModule
  ],
  exports: [MyWalletComponent] // Export the child component
})
export class MyWalletModule {}
