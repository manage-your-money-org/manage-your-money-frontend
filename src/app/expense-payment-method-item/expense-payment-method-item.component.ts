import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PaymentMethod} from "../shared/models/response/PaymentMethod";

@Component({
  selector: 'app-expense-payment-method-item',
  templateUrl: './expense-payment-method-item.component.html',
  styleUrl: './expense-payment-method-item.component.css'
})
export class ExpensePaymentMethodItemComponent {

  @Input() paymentMethods: PaymentMethod[]
  @Output() selectedPaymentMethodChange = new EventEmitter<string[]>();

  selectedPaymentMethodKeys: string[] = [];

  togglePaymentMethodSelection(paymentMethod: PaymentMethod) {

    if (this.isSelected(paymentMethod)) {

      console.log("un-selected: " + paymentMethod.paymentMethodName);
      this.selectedPaymentMethodKeys = this.selectedPaymentMethodKeys.filter(pm => pm !== paymentMethod.key);
    } else {
      console.log("selected: " + paymentMethod.paymentMethodName);
      this.selectedPaymentMethodKeys.push(paymentMethod.key);
    }

    this.selectedPaymentMethodChange.emit(this.selectedPaymentMethodKeys);
  }


  isSelected(paymentMethod: PaymentMethod) {
    return this.selectedPaymentMethodKeys.includes(paymentMethod.key);
  }

}
