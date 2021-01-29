import { AbstractControl, ValidatorFn } from "@angular/forms";
import tronWeb from 'tronweb'

export const tronValidator = (control : AbstractControl) => {
    const tronAddress = tronWeb.isAddress(control.value);        
    return tronAddress ? null : {invalidAddress: true};
}
