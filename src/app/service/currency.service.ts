import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private selectedCurrencies: BehaviorSubject<string> =
    new BehaviorSubject<string>('INR');
  constructor() {}

  getCurrencies() {
    return this.selectedCurrencies.asObservable();
  }
  setCurrencies(currency: string) {
    return this.selectedCurrencies.next(currency);
  }
}
