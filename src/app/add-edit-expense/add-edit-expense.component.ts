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
import {DUPLICATE_EXPENSE_KEY, EXPENSE_CATEGORY_KEY_KEY, EXPENSE_KEY_KEY} from "../shared/constants";
import {ExpenseRequest} from "../shared/models/request/ExpenseRequest";
import {MatSnackBar} from "@angular/material/snack-bar";

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
  isForEditing: boolean = false;
  isForDuplicate: boolean = false;
  expense: ExpenseResponse = {} as ExpenseResponse;
  key: string = '';
  formattedExpenseDate: string;
  expenseAmount: number = 0.0;
  spentOn: string = '';
  heading: string = '';

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
    const duplicateExpense = this.data.map.get(DUPLICATE_EXPENSE_KEY) as ExpenseResponse;

    // this.receivedExpenseCategory = this.activatedRoute.snapshot.params["expenseCategoryKey"];
    // this.key = this.activatedRoute.snapshot.params["key"];

    if (this.key === 'add') {

      this.isForEditing = false;
      this.selectedPaymentMethods = new Set<string>(["CASH"]);
      this.heading = "Add Expense";
    } else if (this.key === 'duplicate') {

      this.isForDuplicate = true;
      this.expense = duplicateExpense;
      this.initUI();
      this.heading = "Duplicate Expense";
    } else {

      this.isForEditing = true;

      this.expenseService.getExpenseByKey(this.key).subscribe((response) => {

        if (response.status === 200) {

          this.expense = response.body;
          this.initUI();
          this.heading = "Edit Expense";
        }
      });
    }
  }

  private initUI() {

    if (this.expense) {
      this.expenseAmount = this.expense.amount;
      this.spentOn = this.expense.spentOn;
      this.selectedPaymentMethods = new Set<string>(this.expense.paymentMethods.map(pm => pm.paymentMethodName));
      this.updateExpenseDateAndTime(this.isForEditing ? new Date(this.expense.expenseDate) : new Date());
    }
  }

  // -----------------------------------------
  saveChanges() {

    console.log("formattedExpenseDate: " + this.formattedExpenseDate);
    console.log("amount: " + this.expenseAmount);
    console.log("spentOn: " + this.spentOn);
    console.log("paymentMethods: " + [...this.selectedPaymentMethods].join(', '));
    console.log("isForEditing: " + this.isForEditing);

    const expenseRequest: ExpenseRequest = {
      amount: this.expenseAmount,
      spentOn: this.spentOn,
      expenseDate: new Date(this.formattedExpenseDate).getTime(),
      categoryKey: this.receivedExpenseCategoryKey,
      paymentMethodsKeys: [],
      newPaymentMethod: [...this.selectedPaymentMethods]
    }

    if (this.isForEditing) {

      expenseRequest.key = this.expense.key;

      this.updateExpense(expenseRequest);

    } else {

      this.createExpense(expenseRequest);
    }

  }

  private updateExpense(expenseRequest: ExpenseRequest) {

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
  }

  private createExpense(expenseRequest: ExpenseRequest) {

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

  // ------------------------------------------

  updateExpenseDateAndTime(date: Date) {

    const userTimeZone = DateUtil.getUserTimeZone();

    console.log("time zone : " + userTimeZone);

    const datePipe = new DatePipe('en-IN');
    const isoDate = new Date(date.getTime()).toISOString();
    this.formattedExpenseDate = datePipe.transform(isoDate, 'yyyy-MM-ddTHH:mm:ss', userTimeZone)

    console.log("local : " + this.formattedExpenseDate);
  }


  // Payment method tags
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

}
