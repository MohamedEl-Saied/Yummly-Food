import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomRecipesComponent } from './random-recipes.component';

describe('RandomRecipesComponent', () => {
  let component: RandomRecipesComponent;
  let fixture: ComponentFixture<RandomRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomRecipesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
