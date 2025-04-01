import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrosServiciosComponent } from './otros-servicios.component';

describe('OtrosServiciosComponent', () => {
  let component: OtrosServiciosComponent;
  let fixture: ComponentFixture<OtrosServiciosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtrosServiciosComponent]
    });
    fixture = TestBed.createComponent(OtrosServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
