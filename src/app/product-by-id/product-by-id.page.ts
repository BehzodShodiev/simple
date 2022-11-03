import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Good } from '../interfaces/good.type';
import { GoodService } from '../service/good.service';

@Component({
  selector: 'app-product-by-id',
  templateUrl: './product-by-id.page.html',
  styleUrls: ['./product-by-id.page.scss'],
})
export class ProductByIdPage implements OnInit {
  prodInfo: Good;
  isLoading: boolean = false;
  amount: any;
  quantity: any;
  amountSubject: Subject<string> = new Subject<string>();
  quantitySubject: Subject<string> = new Subject<string>();
  constructor(
    private goodService: GoodService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getItem();
    this.setListeners();
  }

  getItem() {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.goodService.getItem(id).subscribe(resp => {
      this.isLoading = false;
      this.prodInfo = resp
    });
  }

  amountCalc(amount: any) {
    this.amount = amount || "";
    this.quantity = !amount ? "" : (amount / this.prodInfo.price).toFixed(2);
  }

  quantityCalc(quantity: any) {
    this.quantity = quantity || "";
    this.amount = !quantity ? "" : (quantity * this.prodInfo.price).toFixed(2);
  }

  amountChange(event) {
    this.amountSubject.next(event.target.value);
  }

  quantityChange(event) {
    this.quantitySubject.next(event.target.value)
  }

  setListeners() {
    this.amountSubject.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        this.amountCalc(Number(value));
      });
    this.quantitySubject.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        this.quantityCalc(Number(value));
      });
  }

}
