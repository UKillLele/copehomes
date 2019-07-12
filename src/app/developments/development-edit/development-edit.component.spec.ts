import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentEditComponent } from './development-edit.component';

describe('DevelopmentEditComponent', () => {
  let component: DevelopmentEditComponent;
  let fixture: ComponentFixture<DevelopmentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevelopmentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
