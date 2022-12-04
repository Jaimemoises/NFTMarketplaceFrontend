import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketStatusComponent } from './basket-status.component';

describe('BasketStatusComponent', () => {
  let component: BasketStatusComponent;
  let fixture: ComponentFixture<BasketStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasketStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
