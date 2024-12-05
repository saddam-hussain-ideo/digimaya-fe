// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // BaseUrl: "https://api.mypiptles.com/api/",
  BaseUrl: 'http://3.109.128.219:3000/api/',
  // BaseUrl: 'http://localhost:3000/api/',
  // documentUrl:"http://localhost:3000/",
  // BaseUrl: "http://coin.piptleapp.store:3000/api/",
  captchaKey: '6LetiHwqAAAAAK9KsfWqNqaS9YbncP1cbLci6YU_',
  // captchaKey: '6LcgA_kZAAAAAJznrH215_iDu-E7qp1F4GrY5cAX',
  documentUrl:
    'https://pipezi.com/wp-content/uploads/2021/04/Pipezi-Terms-and-Conditions.pdf',
  privacyPolicy:
    'https://pipezi.com/wp-content/uploads/2021/04/Pipez-Privacy-Policy.pdf',
  defaultLanguage: 'en'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
