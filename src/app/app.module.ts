import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
//Components imports
// import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
// const config: SocketIoConfig = { url: 'https://psocket.cryptoxchange.com/', options: {} };
// const config: SocketIoConfig = { url: 'http://localhost:5000/', options: {} };
import { AppComponent } from './app.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { NotFoundComponent } from './template/not-found/not-found.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from '@angular/forms';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { HeadComponent } from './template/sidebar-header/head.component';
import { Affiliate } from './components/affiliate/affiliate.component';
import { MyWalletComponent } from './components/myWallet/myWallet.component';
import { SettingsComponent } from './components/settings/settings.component';
import { IcoComponent } from './components/ICO/ico.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { QRCodeModule } from 'angular2-qrcode';
import { ChartsModule } from 'ng2-charts';
import { VerifyEmail } from './auth/verfication/verifyEmailcomponent';
import { ForgotPasswordComponent } from './auth/forgotPassword/forgotPassword.component';
import { ResetPassword } from './auth/resetPassword/resetPassword.component';
import { SharedService } from './services/shared';
import { UiSwitchModule } from 'ngx-ui-switch';
import { RecaptchaModule, RECAPTCHA_SETTINGS,RecaptchaSettings} from 'ng-recaptcha';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import { AuthenticateComponent } from './auth/authenticate/authenticate.component';
import { ScrollEventModule } from 'ngx-scroll-event';
import {  HttpClient } from '@angular/common/http';
import { SafePipe } from './safePipe';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { UserSetup } from './auth/user-setup/user-setup.component';
import { NewUserVerify } from './auth/new-user-verification/new-user-verify';
import { WireTransferComponent } from './components/wire-transfer/wire-transfer.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { Currency } from './pipes/currency.pipe';
import { PiptleWalletComponent } from './components/piptle-wallet/piptle-wallet.component';
import { StagesComponent } from './components/stages/stages.component';
import { environment } from 'src/environments/environment';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    Currency,
    AppComponent,
    SignInComponent,
    SignUpComponent,
    NotFoundComponent,
    HeadComponent,
    DashboardComponent,
    HomeComponent,
    Affiliate,
    MyWalletComponent,
    SettingsComponent,
    NotificationsComponent,
    IcoComponent,
    VerifyEmail,
    FaqsComponent,
    ForgotPasswordComponent,
    ResetPassword,
    UserSetup,
    NewUserVerify,
    AuthenticateComponent,
    SafePipe,
    WireTransferComponent,
    PiptleWalletComponent,
    StagesComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    QRCodeModule,
    ChartsModule,
    UiSwitchModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    NgxPaginationModule,
    RecaptchaModule.forRoot(),
    NgbModule.forRoot(),
    ToasterModule.forRoot(),
    // SocketIoModule.forRoot(config),
    ScrollEventModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
  }),
  ],
  providers: [ SharedService,
    TranslateService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: environment.captchaKey } as RecaptchaSettings,
    }], //shared service being injected into modules
  bootstrap: [AppComponent],
  entryComponents: [StagesComponent]
})
export class AppModule { 
  constructor(public _sharedService:SharedService){
    
  }
}
