import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { getLanguage } from './services/utils';
import { SharedService } from './services/shared';
import { ToasterService, ToasterConfig } from 'angular2-toaster';

declare var $: any;
@Component({
  selector: 'crypto-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoading = false;
  public imgSpanish = '../assets/img/esp.png';
  public imgEnglish = '../assets/img/eng.png';
  public config: ToasterConfig = new ToasterConfig({ animation: 'flyRight' });

  public $zopim: any;
  constructor(
    private translate: TranslateService,
    private _sharedService: SharedService,
    private changeRef: ChangeDetectorRef
  ) {
    translate.setDefaultLang(environment.defaultLanguage);
  }

  ngOnInit() {
    localStorage.setItem('language', 'en');
    this._sharedService.updateLoader$.subscribe((a) => {
      console.log(a);
      this.isLoading = a;
      this.changeRef.detectChanges();
    });
    console.log('Environment Testing Dev to Master');
    const language = getLanguage();

    // if (language == 'en') {
    //   $('#dropdownMenu3').css(
    //     'background-image',
    //     'url(' + this.imgEnglish + ')'
    //   );
    //   $('.change-lang').html(
    //     'This website uses cookies to ensure you get the best experience on our website.'
    //   );
    //   $('#linking').html('Read More');
    //   $('#allow').html('Allow Cookies');
    // } else {
    //   $('#dropdownMenu3').css(
    //     'background-image',
    //     'url(' + this.imgSpanish + ')'
    //   );
    //   $('.change-lang').html(
    //     'Este sitio web utiliza Cookies para que tengas la mejor experiencia al navegar.'
    //   );
    //   $('#linking').html('Ver mas detalles');
    //   $('#allow').html('Permitir Cookies');
    // }
    // setTimeout(() => {
    //   // document.getElementById('makeSmall').click();
    // }, 10000);
  }

  switchLanguage(language) {
    if (language == 'en') {
      $('#dropdownMenu3').css(
        'background-image',
        'url(' + this.imgEnglish + ')'
      );
      $('#linking').html('Read More');
    } else {
      $('#dropdownMenu3').css(
        'background-image',
        'url(' + this.imgSpanish + ')'
      );
      $('#linking').html('Ver mas detalles');
    }

    if (language) {
      this.translate.use(language);
      localStorage.setItem('language', language);
      this._sharedService.updateLang(language);
    } else {
      this.translate.use('es');
    }
  }
}
