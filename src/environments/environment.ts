// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // BaseUrl:"http://192.168.2.29:9000/api/",
  // documentUrl:"http://localhost:3000/",

  BaseUrl: "http://coin.piptleapp.store:3000/api/",
  documentUrl: "https://fruture.org/terms-of-use.html",
  privacyPolicy:"https://fruture.org/privacypolicy.html",
  defaultLanguage: 'es'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
