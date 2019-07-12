import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitebuiltComponent } from './sitebuilt.component';

describe('SitebuiltComponent', () => {
  let component: SitebuiltComponent;
  let fixture: ComponentFixture<SitebuiltComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitebuiltComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitebuiltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
