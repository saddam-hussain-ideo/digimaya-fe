import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { MyWalletComponent } from "../myWallet/myWallet.component";


@NgModule({
    declarations: [DashboardComponent],
    imports: [MyWalletComponent]
})
export class DashboardModule { }