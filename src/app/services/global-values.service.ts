import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GlobalValuesService {

  constructor() {
  }

  private currentlyOpenedCategoryNameSubject = new BehaviorSubject<string>('');
  currentlyOpenedExpenseCategoryObservable = this.currentlyOpenedCategoryNameSubject.asObservable();

  updateData(newData: string): void {
    this.currentlyOpenedCategoryNameSubject.next(newData);
  }

  currentlyOpenedCategoryName: string = '';

  updateCurrentlyOpenedCategoryName(categoryName: string) {
    this.currentlyOpenedCategoryName = categoryName;
  }
}
