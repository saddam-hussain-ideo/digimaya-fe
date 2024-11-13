import { AbstractControl, ValidatorFn } from '@angular/forms';

export const tronValidator = (control: AbstractControl) => {
    return {
      invalidAddress: false
    };
}
