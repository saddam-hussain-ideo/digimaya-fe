import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// const APP_VERSION = '1.0.1'; // Update this on every deploy
// const cachedVersion = localStorage.getItem('app_version');

// if (cachedVersion !== APP_VERSION) {
//   console.log('Version changed. Clearing localStorage...');
//   localStorage.clear();
//   sessionStorage.clear();
//   localStorage.setItem('app_version', APP_VERSION);
// }

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
