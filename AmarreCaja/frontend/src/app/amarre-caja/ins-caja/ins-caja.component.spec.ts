import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsCajaComponent } from './ins-caja.component';

describe('InsCajaComponent', () => {
  let component: InsCajaComponent;
  let fixture: ComponentFixture<InsCajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsCajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
