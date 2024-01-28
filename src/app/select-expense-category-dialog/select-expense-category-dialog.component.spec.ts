import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectExpenseCategoryDialogComponent} from './select-expense-category-dialog.component';

describe('SelectExpenseCategoryDialogComponent', () => {
  let component: SelectExpenseCategoryDialogComponent;
  let fixture: ComponentFixture<SelectExpenseCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectExpenseCategoryDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectExpenseCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
