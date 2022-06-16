import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../service/api.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-details',
  templateUrl: './coin-details.component.html',
  styleUrls: ['./coin-details.component.scss'],
})
export class CoinDetailsComponent implements OnInit {
  coinDetails: any;
  coinId!: string;
  days: number = 1;
  currency: string = 'INR';
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: `Price Trends`,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: '#009688',
        pointBackgroundColor: '#009688',
        pointBorderColor: '#009688',
        pointHoverBackgroundColor: '#009688',
        pointHoverBorderColor: '#009688',
      },
    ],
    labels: [],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      point: {
        radius: 1,
      },
    },

    plugins: {
      legend: { display: true },
    },
  };
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) myLineChart!: BaseChartDirective;
  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data) => {
      this.coinId = data['id'];
      console.log(this.coinId);
    });
    this.getOneCurrencyById(this.coinId);
    this.getGraphData(this.days);
    this.currencyService.getCurrencies().subscribe((data) => {
      this.currency = data;
      this.getGraphData(this.days);
      this.getOneCurrencyById(this.coinId);
    });
  }

  getOneCurrencyById(coinId: string) {
    this.api.getCurrencyById(this.coinId).subscribe((data) => {
      console.log(data);

      if (this.currency === 'USD') {
        data.market_data.current_price.inr = data.market_data.current_price.usd;
        data.market_data.market_cap.inr = data.market_data.market_cap.usd;
      }
      this.coinDetails = data;
    });
  }
  getGraphData(days: number) {
    this.days = days;
    this.api
      .getGrpahicalCurrencyData(this.coinId, this.currency, this.days)
      .subscribe((data) => {
        setTimeout(() => {
          this.myLineChart.chart?.update();
        }, 200);
        this.lineChartData.datasets[0].data = data.prices.map((a: any) => {
          return a[1];
        });
        this.lineChartData.labels = data.prices.map((a: any) => {
          let date = new Date(a[0]);
          let time =
            date.getHours() > 12
              ? `${date.getHours() - 12}: ${date.getMinutes()} PM`
              : `${date.getHours()}: ${date.getMinutes()} AM`;
          return this.days === 1 ? time : date.toLocaleDateString();
        });
      });
  }
}
