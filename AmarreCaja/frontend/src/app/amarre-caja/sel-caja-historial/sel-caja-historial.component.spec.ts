import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelCajaHistorialComponent } from './sel-caja-historial.component';

describe('SelCajaHistorialComponent', () => {
  let component: SelCajaHistorialComponent;
  let fixture: ComponentFixture<SelCajaHistorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelCajaHistorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelCajaHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
