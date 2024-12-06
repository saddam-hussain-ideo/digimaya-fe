import { NgModule } from "@angular/core";
import { MyWalletComponent } from "./myWallet.component";

@NgModule({
    declarations: [MyWalletComponent],
    exports: [MyWalletComponent] // Export the child component
})
export class MyWalletModule { }