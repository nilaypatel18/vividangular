import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { pick } from 'lodash';

@Component({
  selector: 'app-section-form',
  templateUrl: './section-form.html'
})
export class SectionFormComponent implements OnInit {
  @Input() section: any = {};
  public submitted: boolean = false;

  constructor(private toasty: ToastrService, public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  submit(frm: any) {
    this.submitted = true;
    if (!frm.valid || this.section.ordering < 0) {
      return this.toasty.error('Please complete the required fields!');
    }
    this.activeModal.close(pick(this.section, ['title', 'description', 'ordering']));
  }
}
