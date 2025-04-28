export const environment = {
  production: false,
  BaseUrl: 'https://develop.api.emaaya.digimaaya.com/api/',
  captchaKey: '6LetiHwqAAAAAK9KsfWqNqaS9YbncP1cbLci6YU_',
  documentUrl:
    'https://pipezi.com/wp-content/uploads/2021/04/Pipezi-Terms-and-Conditions.pdf',
  privacyPolicy:
    'https://pipezi.com/wp-content/uploads/2021/04/Pipez-Privacy-Policy.pdf',
  defaultLanguage: 'en',
  // Withdrawal time limits in 24-hour format (India time)
  withdrawalTimeLimits: {
    startHour: 14, // 2:00 PM
    startMinute: 0,
    endHour: 16, // 4:59 PM
    endMinute: 59
  }
};
