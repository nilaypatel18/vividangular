import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { pick } from 'lodash';

@Component({
  selector: 'my-subject-form',
  templateUrl: './my-subject.html'
})
export class MySubjectFormComponent implements OnInit {
  @Input() subjects: any;
  @Input() mySubject: any;
  @Input() selectedCategory: any;
  public submitted: boolean = false;

  public gradesTutor: any = [
    {
      categoryId: '1',
      categoryName: 'Archaeology',
      key: '1',
      name: 'Science in Archaeology'
    },
    {
      categoryId: '1',
      categoryName: 'Archaeology',
      key: '2',
      name: 'Field Archaeology'
    },
    {
      categoryId: '1',
      categoryName: 'Archaeology',
      key: '3',
      name: 'Iconography'
    },{
      categoryId: '2',
      categoryName: 'Oncology',
      key: '4',
      name: 'Brain Cancer'
    },
    {
      categoryId: '2',
      categoryName: 'Oncology',
      key: '5',
      name: 'Colorectal Cancer'
    },
    {
      categoryId: '2',
      categoryName: 'Oncology',
      key: '6',
      name: 'Hematology'
    },  
    
  ];

  constructor(
    private toasty: ToastrService,
    public activeModal: NgbActiveModal,

  ) {}

  

  ngOnInit() {
    if (this.selectedCategory) {
      this.querySubjects();
    }
  }

  submit(frm: any) {
    this.submitted = true;
    if (!frm.valid) {
      return this.toasty.error('Please complete the required fields!');
    }
    this.activeModal.close(pick(this.mySubject, ['isActive', 'originalSubjectId']));
  }

  querySubjects() {

        this.subjects = this.gradesTutor;
      }
    
  
}
