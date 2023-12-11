import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ExpenseCategoryItemComponent} from './expense-category-item.component';

describe('ExpenseCategoryItemComponent', () => {
    let component: ExpenseCategoryItemComponent;
    let fixture: ComponentFixture<ExpenseCategoryItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExpenseCategoryItemComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ExpenseCategoryItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
