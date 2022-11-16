import { CurrencyService } from './../currency.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CurrencyFormComponent } from '../curreny-form/currency-modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { pick } from 'lodash';

@Component({
  selector: 'app-grade-listing',
  templateUrl: './list.html'
})
export class CurrencyListingComponent implements OnInit {
  public count: number = 0;
  public items = [];
  public currentPage: Number = 1;
  public pageSize: Number = 10;
  public searchFields: any = {};
  public sortOption = {
    sortBy: 'createdAt',
    sortType: 'desc'
  };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private currencyService: CurrencyService,
    private toasty: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.query();
  }

  query() {
    const params = Object.assign(
      {
        page: this.currentPage,
        take: this.pageSize,
        sort: `${this.sortOption.sortBy}`,
        sortType: `${this.sortOption.sortType}`
      },
      this.searchFields
    );
    this.currencyService
      .search(params)
      .then(resp => {
        this.count = resp.data.count;
        this.items = resp.data.items;
      })
      .catch(() => alert('Something went wrong, please try again!'));
  }

  sortBy(field: string, type: string) {
    this.sortOption.sortBy = field;
    this.sortOption.sortType = type;
    this.query();
  }

  remove(item: any, index: number) {
    if (item && item.isDefault) return this.toasty.error('Can not remove default currency');
    if (window.confirm('Are you sure want to delete this currency?')) {
      this.currencyService
        .delete(item._id)
        .then(() => {
          this.toasty.success('Item has been deleted!');
          this.items.splice(index, 1);
          this.count--;
        })
        .catch(() => this.toasty.error('Something went wrong, please try again!'));
    }
  }

  update(item: any = {}) {
    if (item && item.isDefault) return this.toasty.error('Can not update for default currency');
    const modalRef = this.modalService.open(CurrencyFormComponent, {
      size: 'sm'
    });
    if (item._id) {
      modalRef.componentInstance.currency = item;
    }
    modalRef.result.then(
      result => {
        if (!item._id) {
          this.items.push(result);
          this.count++;
          return this.toasty.success('Created successfully');
        }
        this.toasty.success('Updated');
      },
      () => null
    );
  }

  updateActive(item) {
    if (item && item.isDefault) return this.toasty.error('Can not update for default currency');
    let tmp = Object.assign({}, item);
    tmp.isActive = !tmp.isActive;
    this.currencyService
      .update(item._id, pick(tmp, ['isActive', 'symbol', 'name', 'exchangeRate']))
      .then(resp => {
        item.isActive = !item.isActive;
        this.toasty.success('Updated');
      })
      .catch(err =>
        this.toasty.error(
          err.data.data && err.data.data.message ? err.data.data.message : 'Something went wrong, please try again!'
        )
      );
  }
}
