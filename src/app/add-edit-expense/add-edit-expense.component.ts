import {Component, ElementRef, Inject, inject, OnInit, ViewChild} from '@angular/core';
import {ExpenseService} from "../services/expense/expense.service";
import {ExpenseCategoryService} from "../services/expense-category/expense-category.service";
import {ExpenseResponse} from "../shared/models/response/ExpenseResponse";
import {DateUtil} from "../shared/util/DateUtil";
import {DatePipe} from "@angular/common";
import {PaymentMethodService} from "../services/payment-method/payment-method.service";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from 'rxjs/operators';
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {DialogData} from "../shared/models/DialogData";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EXPENSE_CATEGORY_KEY_KEY, EXPENSE_KEY_KEY} from "../shared/constants";
import {ExpenseRequest} from "../shared/models/request/ExpenseRequest";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ExpenseCategoryResponse} from "../shared/models/response/ExpenseCategoryResponse";

@Component({
  selector: 'app-add-edit-expense',
  templateUrl: './add-edit-expense.component.html',
  styleUrl: './add-edit-expense.component.css'
})
export class AddEditExpenseComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  paymentMethodCtrl = new FormControl('');
  filteredPaymentMethods: Observable<string[]>;
  allPaymentMethods: string[] = ["CASH"];
  selectedPaymentMethods: Set<string> = new Set<string>();

  @ViewChild('paymentMethodInput') paymentMethodInput: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer)

  receivedExpenseCategoryKey: string = '';
  receivedExpenseCategory: ExpenseCategoryResponse;
  isForEditing: boolean = false;
  expense: ExpenseResponse = {} as ExpenseResponse;
  key: string = '';
  formattedExpenseDate: string;
  expenseAmount: number = 0.0;
  spentOn: string = '';

  constructor(private expenseService: ExpenseService,
              private expenseCategoryService: ExpenseCategoryService,
              private paymentMethodService: PaymentMethodService,
              private _snackbar: MatSnackBar,
              public dialogRef: MatDialogRef<AddEditExpenseComponent>,
              @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {

    this.updateExpenseDateAndTime(new Date());

    this.filteredPaymentMethods = this.paymentMethodCtrl.valueChanges.pipe(
      startWith(null),
      map((pm: string | null) => (pm ? this._filter(pm) : this.allPaymentMethods.slice())),
    );
  }

  ngOnInit(): void {

    this.paymentMethodService.getAllPaymentMethodsOfUser().subscribe((response) => {

      if (response.status === 200) {
        this.allPaymentMethods = response.body.map(pm => pm.paymentMethodName);

        this.filteredPaymentMethods = this.paymentMethodCtrl.valueChanges.pipe(
          startWith(null),
          map((pm: string | null) => (pm ? this._filter(pm) : this.allPaymentMethods.slice())),
        );
      }
    });

    this.receivedExpenseCategoryKey = this.data.map.get(EXPENSE_CATEGORY_KEY_KEY);
    this.key = this.data.map.get(EXPENSE_KEY_KEY);

    // this.receivedExpenseCategory = this.activatedRoute.snapshot.params["expenseCategoryKey"];
    // this.key = this.activatedRoute.snapshot.params["key"];

    if (this.key !== 'add') {

      this.isForEditing = true;

      this.expenseService.getExpenseByKey(this.key).subscribe((response) => {

        if (response.status === 200) {

          this.expense = response.body;
          this.expenseAmount = this.expense.amount;
          this.spentOn = this.expense.spentOn;
          this.selectedPaymentMethods = new Set<string>(this.expense.paymentMethods.map(pm => pm.paymentMethodName));
          this.updateExpenseDateAndTime(new Date(this.expense.expenseDate));
        }
      });
    } else {

      this.isForEditing = false;
      this.selectedPaymentMethods = new Set<string>(["CASH"]);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.selectedPaymentMethods.add(value.toUpperCase());
    }

    // Clear the input value
    event.chipInput!.clear();

    this.paymentMethodCtrl.setValue(null);
  }

  remove(fruit: string): void {

    if (fruit !== '') {
      this.selectedPaymentMethods.delete(fruit.toUpperCase());

      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedPaymentMethods.add(event.option.viewValue);
    this.paymentMethodInput.nativeElement.value = '';
    this.paymentMethodCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allPaymentMethods.filter(pm => pm.toLowerCase().includes(filterValue));
  }

  updateExpenseDateAndTime(date: Date) {

    const userTimeZone = DateUtil.getUserTimeZone();

    console.log("time zone : " + userTimeZone);

    const datePipe = new DatePipe('en-IN');
    const isoDate = new Date(date.getTime()).toISOString();
    this.formattedExpenseDate = datePipe.transform(isoDate, 'yyyy-MM-ddTHH:mm:ss', userTimeZone)

    console.log("local : " + this.formattedExpenseDate);
  }

  saveChanges() {

    console.log("formattedExpenseDate: " + this.formattedExpenseDate);
    console.log("amount: " + this.expenseAmount);
    console.log("spentOn: " + this.spentOn);
    console.log("paymentMethods: " + [...this.selectedPaymentMethods].join(', '));
    console.log("isForEditing: " + this.isForEditing);

    if (this.isForEditing) {

      // update the changes
      const expenseRequest: ExpenseRequest = {
        amount: this.expenseAmount,
        spentOn: this.spentOn,
        expenseDate: new Date(this.formattedExpenseDate).getTime(),
        categoryKey: this.receivedExpenseCategoryKey,
        paymentMethodsKeys: [],
        newPaymentMethod: [...this.selectedPaymentMethods],
        key: this.expense.key
      }

      this.expenseService.updateExpense(expenseRequest).subscribe((response) => {

        if (response.status === 200) {

          // show toast
          this._snackbar.open("Expense Updated", '', {
            duration: 5000
          });

          this.updateExpenseCategory();
          this.dialogRef.close(response.body.body);

        } else {
          // show toast
          this._snackbar.open("Something went wrong", '', {
            duration: 5000
          });
        }
      });

    } else {

      // add new expense
      const expenseRequest: ExpenseRequest = {
        amount: this.expenseAmount,
        spentOn: this.spentOn,
        expenseDate: new Date(this.formattedExpenseDate).getTime(),
        categoryKey: this.receivedExpenseCategoryKey,
        paymentMethodsKeys: [],
        newPaymentMethod: [...this.selectedPaymentMethods]
      }

      this.expenseService.createNewExpense(expenseRequest).subscribe((response) => {

        if (response.status === 201) {
          // show toast
          this._snackbar.open("Expense Added", '', {
            duration: 5000
          });

          this.updateExpenseCategory();
          this.dialogRef.close(response.body.body);

        } else {
          // show toast
          this._snackbar.open("Something went wrong", '', {
            duration: 5000
          });
        }
      });
    }

  }

  updateExpenseCategory() {

    this.expenseCategoryService.getExpenseCategoryByKey(this.receivedExpenseCategoryKey)
      .subscribe((response) => {

        if (response.status === 200) {
          this.expenseCategoryService.updateExpenseCategory(
            {
              categoryName: response.body.body.categoryName,
              categoryDescription: response.body.body.categoryDescription,
              imageUrl: response.body.body.imageUrl,
              key: response.body.body.key
            }
          ).subscribe((res) => {

            if (res.status === 200) {
              console.log("Expense Category updated")
            }
          })
        }
      });
  }
}
