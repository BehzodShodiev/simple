import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Good } from '../interfaces/good.type';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class GoodService {

  constructor(
    private http: HttpClient,
    ) { }

  getAllData(page) {
    let url = '/assets/data.json';
    return this.http.get<Good[]>(url).pipe(
      map(data => {
        return data.slice((page - 1) * 20, page * 20)
      })
    );
  }

  getSearchData(text) {
    let url = '/assets/data.json';
    return this.http.get<Good[]>(url).pipe(
      map(data => {
        return data.filter(el => {
          let str = el.name.toLowerCase();
          return str.includes(text.toLowerCase())
        }).slice(0, 10);
      })
    );
  }

  getItem(id) {
    let url = '/assets/data.json';
    return this.http.get<Good[]>(url).pipe(
      map(data => {
        return data.find(el => el.sku == id)
      })
    );
  }
}
