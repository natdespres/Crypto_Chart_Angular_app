import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from './data.service';
import { MatTable } from '@angular/material/table';
import {MatTableDataSource} from '@angular/material/table';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { enCA } from 'date-fns/locale';
import { add, parseISO } from 'date-fns';
import 'chartjs-adapter-date-fns';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(
    private dataService: DataService
  ){}

  @ViewChild(MatTable) theTable!: MatTable<any>;
  i: any = 0;
  coinList: any;
  selectedCoin: any;
  dataSource: any;
  displayedColumns: string[] = ['symbol', 'current price', 'market cap'];
  marketData: any;

  lineChartOptions: ChartConfiguration['options'] = {
      elements: {
        line: {
          tension: 0.5
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            // unit: 'millisecond',
            // tooltipFormat: 'DD T'
            displayFormats: {
                hour: 'MMM dd hh:mm a'
            }
          },
          adapters: {
            date: {
              locale: enCA
            }
          },
          ticks: {
            source: 'auto'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Price (USD)'
          }
        }
      },
    };

  lineChartType: ChartType = 'line';

  lineChartData: ChartConfiguration['data'] = {labels: [],datasets: []};

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  updateChart(coinId: any){
    this.dataService.getCoinMarketData(coinId).subscribe(
      data => {
        this.marketData = data;
        // console.log(this.marketData);
        let dt = [];
        let lb = [];
        let thing = [];
        for (let price of this.marketData.prices) {
          // let date = new Date(price[0]).toDateString();
          // lb.push(Math.trunc(price[0]/1000/60));
          // lb.push(date);
          lb.push(price[0]);
          dt.push(price[1]);
          thing.push(price);
        }
        // console.log(lb);
        // console.log(dt);
        // console.log(thing);
        this.lineChartData.labels = lb;
        this.lineChartData.datasets = [{data: dt, label: coinId}];
        // console.log(this.lineChartData.datasets);
        this.chart?.update();
      },
      err => console.error('observer got an error'+ err)
    );
  }

  updatePage(y: any){
    console.log(y);
    this.dataSource = [this.coinList[y.value]];
    this.theTable.renderRows();
    this.updateChart(this.coinList[y.value].id);
  }


  ngOnInit():void {
    // console.log(this.selectedCoin);

    this.dataService.getCoinList().subscribe(
      data => {
        this.coinList = data;
        this.dataSource = [this.coinList[0]];
        this.updateChart(this.coinList[0].id);
      },
      err => console.error('observer got an error'+err),
    );
    // this.dataSource = [this.coinList[0]];
    // console.log('2');
    // this.updateChart(this.coinList[].id);
  }

}
