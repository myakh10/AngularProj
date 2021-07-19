import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './users/user-single/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUsersUrl = "https://reqres.in/api/users";
  // save tokens in this array to let the sign in possible only to the users who signed
  tokens: Array<string>;
  // array to be able to show only signed up users in the user list page
  signedUpUsers: User[];
  // map to keep in memory the password of each user
  usersPasswordsMap = new Map();

  constructor(private http: HttpClient) {
    this.tokens = new Array<string>();
    this.signedUpUsers = [];
  }

  async doInscription(router: Router, email: string, password: string): Promise<void> {
    const response = await this.getInscriptionResponse(email, password);
    if(response.status == 200){
      const data = await response.json();

      this.addToUserPasswordMap(email, password);
      this.addToken(data.token);

      this.getUser(data.id)
      .subscribe(user => {
        this.addSignedUpUser(user);
      });

      router.navigateByUrl('/authentification');
    }
  }

  async doAuthentification(router: Router, email: string, password: string): Promise<void> {
    const response = await this.getAuthentificationResponse(email, password);
    if(response.status == 200){
      const data = await response.json();

      if(this.getTokens().includes(data.token)){
        router.navigateByUrl('/users');
      }
    }
  }

  addToUserPasswordMap(email: string, password: string): void {
    this.usersPasswordsMap.set(email, password);
  }

  isPasswordCorrect(email: string, password: string): boolean {
    const pass = this.usersPasswordsMap.get(email);
    return pass == password;
  }

  async isUserAlreadyRegistered(email: string, password: string): Promise<boolean> {
    const response = await this.getInscriptionResponse(email, password);

    if(response.status == 200){
      const data = await response.json();

      if(this.tokens.includes(data.token)){
        return true;
      }
    }
    return false;
  }

  async isEmailFromReqRes(email: string, password: string): Promise<boolean> {
    const response = await this.getInscriptionResponse(email, password);
    if(response.status == 200){
      return true;
    }
    return false;
  }

  addSignedUpUser(user: User): void {
    this.signedUpUsers.push(user);
  }

  getSignedUpUsers(): Observable<User[]> {
    return of(this.signedUpUsers);
  }

  addToken(token: string): void {
    this.tokens.push(token);
  }

  getTokens(): string[] {
    return this.tokens;
  }

  // get all the users
  getUsers() {
    return this.http.get(`${this.apiUsersUrl}`).pipe(map((result:any)=>result.data));;
  }

  // get the user data 
  getUser(username: string) {
    return this.http.get(`${this.apiUsersUrl}/${username}`).pipe(map((result:any)=>result.data));;;
  }

  getInscriptionResponse(email: string, password: string) {
    // POST request using fetch()
    return fetch("https://reqres.in/api/register", {
    method: "POST",
    body: JSON.stringify({
      "email": email,
      "password": password
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
    });
  }

  async getInscriptionToken(email: string, password: string) {
    const response = await this.getInscriptionResponse(email, password);
    if(response.status == 200){
      const data = await response.json();
      
      return data.token;
    }
  }

  getAuthentificationResponse(email: string, password: string) {
    // POST request using fetch()
    return fetch("https://reqres.in/api/login", {
    method: "POST",
    body: JSON.stringify({
      "email": email,
      "password": password
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
    });
  }
}
