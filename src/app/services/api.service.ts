import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _httpClient: HttpClient) { }
  get(url: string, apiKey) {
    //return this._httpClient.get(`${environment.apiURL}/${url}`,{headers:{'token':this._userService.getToken()}});
    return this._httpClient.get(`${environment.apiURL}/${url}${apiKey}`, { headers: { 'Content-Type': 'application/json' } });
  }

  // post(url: string, body: any) {
  //   return this._httpClient.post(`${environment.apiURL}/${url}`, body);
  // }

  // PUT(url:string,body:any)
  // {
  //   return this._httpClient.put(`${environment.apiURL}/${url}`,body);
  // }

  // delete(url:string)
  // {
  //   return this._httpClient.delete(`${environment.apiURL}/${url}`);
  // }

}
