import { Component } from '@angular/core';
import { CurrencyService } from './service/currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  selectedValue: string = 'INR';
  constructor(private currencyService: CurrencyService) {}

  updateCurrency(event: string) {
    console.log(event);
    this.currencyService.setCurrencies(event);
  }
}
