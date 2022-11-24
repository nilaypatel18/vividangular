import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  Type,
  Input,
  ViewContainerRef,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicChildLoaderDirective } from './modal-dialog.directive';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
})
export class ModalDialogComponent implements OnInit {
  @Input() template: any = [];

  @ViewChild(DynamicChildLoaderDirective, { static: true })
  dynamicChild!: DynamicChildLoaderDirective;

  public component: Type<any>;
  public c_data: any;
  public description: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.description = data.title;
    this.component = data.component;
    this.c_data = data;
  }

  ngOnInit(): void {
    this.loadComponent(this.component);
  }

  loadComponent(comp: any) {
    const viewContainerRef = this.dynamicChild.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<any>(comp);
    componentRef.instance.data = this.c_data;
  }
}
