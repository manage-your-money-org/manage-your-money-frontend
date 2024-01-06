import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UnsplashImageItemComponent} from './unsplash-image-item.component';

describe('UnsplashImageItemComponent', () => {
  let component: UnsplashImageItemComponent;
  let fixture: ComponentFixture<UnsplashImageItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnsplashImageItemComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UnsplashImageItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
