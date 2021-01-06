import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currency' })
export class Currency implements PipeTransform {
  transform(value, currency) {
    if(value) {
        value = value.toString();
        if(value.includes('.')) {
            value = value.split('.')
            let check =  currency == 'crypto' && value[1].length > 8 ?
            `${value[0]}.${value[1].slice(0, 8)}` :
            currency == 'fait' && value[1].length > 2 ?
            `${value[0]}.${value[1].slice(0, 2)}` :
            // `${value[0]}.${value[1]}`
            `${value[0]}.${value[1].slice(0,6)}`
            return check;
        }
    }
    return (value);
  }
}