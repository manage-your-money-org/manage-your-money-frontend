import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventHandlerService {

  constructor() {
  }

  private sortMenuForExpenseCategorySubject = new Subject<string>();
  sortMenuForExpenseCategoryClick = this.sortMenuForExpenseCategorySubject.asObservable();


  emitSortMenuForExpenseCategoryMenuClick(menuItem: string) {
    this.sortMenuForExpenseCategorySubject.next(menuItem);
  }
}
