import { UserService } from './user.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService
  ) {}

  getAndCreateRating(url) {
    return this._httpClient.get(`${environment.communityURL}/${url}`);
  }
  updateRating(url, newRate) {
    return this._httpClient.put(`${environment.communityURL}/${url}`, newRate, {
      headers: { authorization: this._userService.getToken() },
    });
  }
  addReview(url, review) {
    console.log('From service', review);
    return this._httpClient.post(
      `${environment.communityURL}/${url}`,
      { review },
      {
        headers: { authorization: this._userService.getToken() },
      }
    );
  }
}
