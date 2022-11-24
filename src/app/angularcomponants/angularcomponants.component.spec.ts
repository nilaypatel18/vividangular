import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularcomponantsComponent } from './angularcomponants.component';

describe('AngularcomponantsComponent', () => {
  let component: AngularcomponantsComponent;
  let fixture: ComponentFixture<AngularcomponantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularcomponantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularcomponantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
