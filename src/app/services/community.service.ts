import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService
  ) { }
  // register user
  CreateUser(url, newUser) {
    return this._httpClient.post(`${environment.communityURL}/${url}`, newUser);
  }
  LoginUser(url, userData) {
    return this._httpClient.post(
      `${environment.communityURL}/${url}`,
      userData
    );
  }
  getUser(url) {
    return this._httpClient.get(`${environment.communityURL}/${url}`);
  }
  editUser(url: String, userID, newUserData) {
    return this._httpClient.put(
      `${environment.communityURL}/${url}/${userID}`,
      newUserData, {
      headers: { authorization: this._userService.getToken() },
    }
    );
  }
  searchUser(url) {
    return this._httpClient.get(`${environment.communityURL}/${url}`, {
      headers: { authorization: this._userService.getToken() },
    });
  }
  getAllPosts(url: string) {
    console.log(this._userService.getToken());
    return this._httpClient.get(`${environment.communityURL}/${url}`, {
      headers: { authorization: this._userService.getToken() },
    });
  }
  createPost(url: string, post) {
    return this._httpClient.post(`${environment.communityURL}/${url}`, post, {
      headers: { authorization: this._userService.getToken() },
    });
  }

  deletePost(url: string, postID: string) {
    return this._httpClient.delete(
      ` ${environment.communityURL}/${url}/${postID}`,
      {
        headers: { authorization: this._userService.getToken() },
      }
    );
  }
  showPostDetails(url: string, postID: string) {
    return this._httpClient.get(
      `${environment.communityURL}/${url}/${postID}`,
      {
        headers: { authorization: this._userService.getToken() },
      }
    );
  }
  editPostDetails(url: string, postDetails) {
    return this._httpClient.put(
      `${environment.communityURL}/${url}`,
      postDetails,
      {
        headers: { authorization: this._userService.getToken() },
      }
    );
  }
  addToFavorite(url: string) {
    return this._httpClient.post(
      `${environment.communityURL}/${url}`,
      {},
      {
        headers: { authorization: this._userService.getToken() },
      }
    );
  }
  removeFromFavorite(url: string) {
    console.log(url);
    return this._httpClient.put(
      `${environment.communityURL}/${url}`,
      {},
      {
        headers: { authorization: this._userService.getToken() },
      }
    );
  }
  createComment(url: string, comment) {
    // post/postId/create-comment
    return this._httpClient.post(
      `${environment.communityURL}/${url}`,
      comment,
      {
        headers: { authorization: this._userService.getToken() },
      }
    );
  }
  deleteComment(url: string) {
    return this._httpClient.delete(`${environment.communityURL}/${url}`, {
      headers: { authorization: this._userService.getToken() },
    });
  }
  editComment(url: string, comment) {
    return this._httpClient.put(`${environment.communityURL}/${url}`, comment, {
      headers: { authorization: this._userService.getToken() },
    });
  }
  createFeedBack(url, message) {
    return this._httpClient.post(`${environment.communityURL}/${url}`, message);
  }
  likeOrUnlikePost(url, like) {
    return this._httpClient.post(`${environment.communityURL}/${url}`, { like }, {
      headers: { authorization: this._userService.getToken() },
    });
  }
}
