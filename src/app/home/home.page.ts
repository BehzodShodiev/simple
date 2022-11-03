import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonInfiniteScroll, IonSearchbar, NavController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators"
import { Good } from '../interfaces/good.type';
import { GoodService } from '../service/good.service';
import { Subject } from 'rxjs';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  currentGoods: Good[] = [];
  page: number = 1;
  isLoading: boolean;
  inputSubject: Subject<string> = new Subject<string>();
  skeletonArr = new Array(8);
  searchData: Good[] = [];
  searchValue: string = "";
  searchEmpty: boolean;
  constructor(
    private goodService: GoodService,
    private storageService: StorageService,
    private navCtr: NavController
  ) { }

  ngOnInit() {
    this.storageService.init().then(() => {
      this.storageService.get("searchData").then((data) => {
        this.searchValue = data;
        this.isLoading = true;
        this.getSearchData();
      })
    });
    this.getData();
    this.searchListener();
  }

  getData(event?) {
    if (!event) this.isLoading = true;
    setTimeout(() => {
      this.goodService.getAllData(this.page).subscribe((data) => {
        this.isLoading = false;
        this.currentGoods.push(...data);
        if (!data.length) {
          this.infiniteScrollState(true);
        }
        if (event) event.target.complete();
      })
    }, this.getRandomTime());
  }

  search(event) {
    if (event.target.value == "") {
      this.infiniteScrollState(false);
      this.storageService.set("searchData", "");
      this.isLoading = false;
    }
    this.isLoading = true;
    this.inputSubject.next(event.target.value);
  }

  getSearchData(inp: string = this.searchValue) {
    setTimeout(() => {
      this.storageService.set("searchData", inp);
      this.infiniteScrollState(true);
      this.goodService.getSearchData(inp).subscribe((data) => {
        this.isLoading = false;
        this.searchData = data
        if (!this.searchData.length)  {
          this.searchEmpty = true;
          return;
        }
        this.searchEmpty = false;
      });
    }, this.getRandomTime());
  }


  searchListener() {
    this.inputSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(inp => this.getSearchData(inp));
  }

  handleRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 500);
    if (this.searchValue) {
      this.isLoading = true;
      this.getSearchData();
      return;
    }
    this.page = 1;
    this.currentGoods = [];
    this.infiniteScrollState(false);
    this.getData();
  }

  infiniteScrollState(disabled) {
    if (this.infiniteScroll) this.infiniteScroll.disabled = disabled;
  }

  getRandomTime() {
    const MAX_TIME = 7;
    const MIN_TIME = 3;
    return Math.floor(Math.random() * (MAX_TIME - MIN_TIME) + MIN_TIME) * 1000;
    // return Math.floor(Math.random() * (MAX_TIME - MIN_TIME) + MIN_TIME);
  }

  loadData(event) {
    this.page++;
    this.getData(event)
  }

  goToItem(id) {
    this.navCtr.navigateForward(`product-by-id/${id}`)
  }
}
