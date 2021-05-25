// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // BaseUrl:"http://192.168.100.65:9000/api/",
  // documentUrl:"http://localhost:3000/",

  BaseUrl: "http://coin.piptleapp.store:3000/api/",
  storeUrl : 'https://api-stg.piptleapp.store/api/pipezi',
  bearerToken: 'lDIUD1uXQhSJSF3QoVC5WiC54iLG1FpV748Pxqdzp2PG5tkffgIDVRObhMBMYNUxr2tt6188HQ04hkgxjwiLzpXikdAvpZkqP3vG',
  // BaseUrl: "https://api.mypiptles.com/api/",
  captchaKey: '6LcY8zIaAAAAAJrc0THvOOZyjIdJKLYAl3tHnITp',
  // captchaKey: '6LcgA_kZAAAAAJznrH215_iDu-E7qp1F4GrY5cAX',
  //old captchakey : 6LcgA_kZAAAAAJznrH215_iDu-E7qp1F4GrY5cAX
  documentUrl: "https://pipezi.com/wp-content/uploads/2021/04/Pipezi-Terms-and-Conditions.pdf",
  privacyPolicy:"https://pipezi.com/wp-content/uploads/2021/04/Pipez-Privacy-Policy.pdf",
  defaultLanguage: 'en'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
