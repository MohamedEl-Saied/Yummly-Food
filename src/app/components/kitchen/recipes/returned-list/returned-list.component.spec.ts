import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnedListComponent } from './returned-list.component';

describe('ReturnedListComponent', () => {
  let component: ReturnedListComponent;
  let fixture: ComponentFixture<ReturnedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
