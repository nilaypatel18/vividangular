import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
})
export class SelectComponent implements OnInit {
  @Output() handleSelect: EventEmitter<string> = new EventEmitter();
  @Input() options: any = []
  public selected: string = ''

  onChangeHadle(value: any) {
    this.handleSelect.emit(this.selected)
  }
  constructor() { }

  ngOnInit(): void {
  }

}
