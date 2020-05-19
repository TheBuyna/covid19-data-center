import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Covid19ApiService {
  constructor(private httpClnt: HttpClient) {
    this.getSummary();
  }

  getSummary() {
    return this.httpClnt.get('https://api.covid19api.com/summary');
  }
}
