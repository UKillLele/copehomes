import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturedComponent } from './manufactured.component';

describe('ManufacturedComponent', () => {
  let component: ManufacturedComponent;
  let fixture: ComponentFixture<ManufacturedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManufacturedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
