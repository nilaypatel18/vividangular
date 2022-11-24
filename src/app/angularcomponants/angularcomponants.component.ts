import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalDialogComponent } from '../utils/components/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-angularcomponants',
  templateUrl: './angularcomponants.component.html',
  styleUrls: ['./angularcomponants.component.css'],
})
export class AngularcomponantsComponent implements OnInit {
  exoptions: object = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];
  todoSelected: string = '';
  todoRange: object = {
    start: '2022-09-11',
    end: '2022-09-25',
  };
  todoDate: string = '2022-09-11';

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '350px';
    dialogConfig.width = '500px';
    dialogConfig.data = {
      component: '',
      title: 'Add ToDo',
    };

    const dialogRef = this.dialog.open(ModalDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data)
    });
  }

  onSelect(value: string) {
    this.todoSelected = value;
  }

  dateHandleChange(value: object) {
    console.log(value);
  }

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}
}
