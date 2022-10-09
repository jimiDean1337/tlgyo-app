import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BakedSaleComponent } from './baked-sale.component';

describe('BakedSaleComponent', () => {
  let component: BakedSaleComponent;
  let fixture: ComponentFixture<BakedSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BakedSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BakedSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
