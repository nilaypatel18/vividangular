import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
})
export class DatepickerComponent implements OnInit {
  @Input() selectedDate: any;
  @Output() selectHandle: EventEmitter<any> = new EventEmitter();

  date: any = new FormControl(new Date());

  handleDataChange() {
    const value = this.date.value;
    const datevalue = this.datepipe.transform(value, 'yyyy-MM-dd');
    this.selectHandle.emit(datevalue);
  }

  constructor(public datepipe: DatePipe) {}

  ngOnInit(): void {
    this.date = new FormControl(new Date(this.selectedDate));
  }
}
