import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-daterangepicker',
  templateUrl: './daterangepicker.component.html',
})
export class DaterangepickerComponent implements OnInit {
  @Input() selectedRange: any;
  @Output() selectHandle: EventEmitter<object> = new EventEmitter();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  handleDataChange() {
    const value = this.range.value;
    const startDate = this.datepipe.transform(value.start, 'yyyy-MM-dd');
    const endDate = this.datepipe.transform(value.end, 'yyyy-MM-dd');
    const expDate = {
      start: startDate,
      end: endDate,
    };
    this.selectHandle.emit(expDate);
  }

  constructor(public datepipe: DatePipe) {}

  ngOnInit(): void {
    this.range = new FormGroup({
      start: new FormControl<Date | null>(
        (this.selectedRange && new Date(this.selectedRange.start)) || null
      ),
      end: new FormControl<Date | null>(
        (this.selectedRange && new Date(this.selectedRange.end)) || null
      ),
    });
  }
}
