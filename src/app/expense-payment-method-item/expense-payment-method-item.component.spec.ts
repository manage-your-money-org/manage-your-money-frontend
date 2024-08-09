import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExpensePaymentMethodItemComponent} from './expense-payment-method-item.component';

describe('ExpensePaymentMethodItemComponent', () => {
  let component: ExpensePaymentMethodItemComponent;
  let fixture: ComponentFixture<ExpensePaymentMethodItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpensePaymentMethodItemComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExpensePaymentMethodItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
