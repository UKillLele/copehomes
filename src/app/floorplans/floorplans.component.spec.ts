import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorplansComponent } from './floorplans.component';

describe('FloorplansComponent', () => {
  let component: FloorplansComponent;
  let fixture: ComponentFixture<FloorplansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloorplansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorplansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
