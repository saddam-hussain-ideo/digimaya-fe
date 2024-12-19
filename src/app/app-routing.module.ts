import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { NotFoundComponent } from './template/not-found/not-found.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Affiliate } from './components/affiliate/affiliate.component';
import { MyWalletComponent } from './components/myWallet/myWallet.component';
import { SettingsComponent } from './components/settings/settings.component';
import { IcoComponent } from './components/ICO/ico.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { VerifyEmail } from './auth/verfication/verifyEmailcomponent';
import { ForgotPasswordComponent } from './auth/forgotPassword/forgotPassword.component';
import { ResetPassword } from './auth/resetPassword/resetPassword.component';
import { AuthenticateComponent } from './auth/authenticate/authenticate.component';
import { UserSetup } from './auth/user-setup/user-setup.component';
import { NewUserVerify } from './auth/new-user-verification/new-user-verify';
import { WireTransferComponent } from './components/wire-transfer/wire-transfer.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { PiptleWalletComponent } from './components/piptle-wallet/piptle-wallet.component';
import { StakinghistoryComponent } from './components/stakinghistory/stakinghistory.component';
import { LandingPageComponent } from './components/landing/landing.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { DisclaimerAgreementComponent } from './components/disclaimer-and-agreement/disclaimer-and-agreement.component';

const routes: Routes = [
  { path: 'landing', component: LandingPageComponent },
  { path: 'cookie-policy', component: CookiePolicyComponent },
  { path: 'disclaimer-and-agreement', component: DisclaimerAgreementComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  {
    path: 'api',
    children: [
      { path: '', redirectTo: 'referral/[refferedToken]', pathMatch: 'full' },
      { path: 'referral/:ref', component: SignUpComponent }
    ]
  },
  { path: 'verification', component: VerifyEmail },
  { path: 'new-user-verification', component: NewUserVerify },
  { path: 'user-setup', component: UserSetup },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPassword },
  { path: 'authenticate', component: AuthenticateComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      { path: 'dashboard/:id', component: DashboardComponent },
      { path: 'affiliate', component: Affiliate, canActivate: [AuthGuard] },
      //// TODO: Commenting as not in use {
      //   path: 'wallet',
      //   component: PiptleWalletComponent,
      //   canActivate: [AuthGuard]
      // },
      //// TODO: Commenting as not in use {
      //   path: 'my-wallet',
      //   component: MyWalletComponent,
      //   canActivate: [AuthGuard]
      // },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
      },
      // TODO: Commenting as not in use { path: 'ilo', component: IcoComponent, canActivate: [AuthGuard] },
      { path: 'faqs', component: FaqsComponent, canActivate: [AuthGuard] },
      // TODO: Commenting as per demand of Project Manager{
      //   path: 'wire-transfer',
      //   component: WireTransferComponent,
      //   canActivate: [AuthGuard],
      // },
      {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'stakinghistory',
        component: StakinghistoryComponent,
        canActivate: [AuthGuard]
      }
    ]
  },

  //Should be at last in routes
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
