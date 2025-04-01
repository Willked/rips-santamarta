import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RipsJsonComponent } from './rips-json.component';

describe('RipsJsonComponent', () => {
  let component: RipsJsonComponent;
  let fixture: ComponentFixture<RipsJsonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RipsJsonComponent]
    });
    fixture = TestBed.createComponent(RipsJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
