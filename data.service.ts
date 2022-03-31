import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient,) {
  }

  getCoinList(){
    return this.http.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
  }

  getCoinMarketData(coinId: string){
    return this.http.get('https://api.coingecko.com/api/v3/coins/'+ coinId +'/market_chart?vs_currency=usd&days=1');
  }
}
