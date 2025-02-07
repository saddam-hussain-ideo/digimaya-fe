import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { MyWalletModule } from '../myWallet/myWallet.module'; // Import the module
import { CommonModule } from '@angular/common'; // Import CommonModule
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angular2-qrcode';
import { ToasterModule } from 'angular2-toaster';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from 'src/app/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    MyWalletModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    QRCodeModule,
    ToasterModule,
    ChartsModule,
    NgxPaginationModule
  ], // Use the module here
  exports: [DashboardComponent] // Export the child component
})
export class DashboardModule {}
