import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritesPostsComponent } from './favourites-posts.component';

describe('FavouritesPostsComponent', () => {
  let component: FavouritesPostsComponent;
  let fixture: ComponentFixture<FavouritesPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavouritesPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritesPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
