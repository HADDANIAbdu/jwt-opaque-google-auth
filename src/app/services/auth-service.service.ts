import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environements/env';
import { Token } from '../dto/Token';
import { Observable } from 'rxjs';
import { Register } from '../dto/register';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  token: string = "";

  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }
  
  getGoogleUrl(): any {
    return this.http.get(this.apiUrl+"/auth/url");
  }

  getUserInfo(){
    return this.http.get<ApiResponse>(this.apiUrl+"/profile",
      {
        headers: new HttpHeaders(
          {
            "Authorization": "Bearer "+this.token
          }
        )
      }
    ).pipe(
      map((response: ApiResponse) => {
        this.setItem('user-info', response.data);
        return response;
      })
    );
  }
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        map(response => {
          if (response && response.data) {
            this.setItem('token', response.data.token);
            this.token = response.data.token;
          }
          return response;
        })
      );
  }

  register(register: Register): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, register);
  }

  getDocuments(){
    return this.http.get<ApiResponse>(this.apiUrl+"/documents",
      {
        headers: new HttpHeaders(
          {
            "Authorization": "Bearer "+this.token
          }
        )
      }
    )
  }

  getToken(code: string): Observable<boolean> {
    return this.http.get<Token>(this.apiUrl+"/auth/callback?code=" + code, {observe: "response"})
      .pipe(map((response: HttpResponse<Token>) => {
        if (response.status === 200 && response.body !== null) {
          this.token = response.body.token;
          return true;
        } else {
          return false;
        }
      }));
  }

  logOut(): void{
    this.token = "";
    this.removeItem("user-info");
  }

  setItem(key: string, value: any): void{
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  removeItem(key: string): void{
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }

  getItem(key: string): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }

  addPhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post<any>(`${this.apiUrl}/add-photo`, formData, {
      headers: new HttpHeaders(
        {
          "Authorization": "Bearer "+this.token
        }
      )
    }).pipe(
      map(response => {
        if (response && response.data) {
          const userInfo = this.getItem('user-info');
          if (userInfo) {
            userInfo.photo = response.data.photo;
            this.setItem('user-info', userInfo);
          }
        }
        return response;
      })
    );
  }
}

export interface ApiResponse {
  status: string;
  message: string;
  data: any;
}
