import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {SharedDate} from "../shared/models/SharedDate";

@Injectable({
  providedIn: 'root'
})
export class GlobalValuesService {

  constructor() {
  }

  private sharedDataSubject = new BehaviorSubject<SharedDate>({});
  sharedData = this.sharedDataSubject.asObservable();

  updateData(newData: SharedDate): void {
    this.sharedDataSubject.next(newData);
  }
}
