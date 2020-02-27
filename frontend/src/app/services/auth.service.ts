import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import "rxjs/add/operator/map";
import { tokenNotExpired } from "angular2-jwt";

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  baseUri: string = "http://localhost:8080";

  constructor(private http: Http) {}

  registerUser(user) {
    let headers = new Headers();
    headers.append("Content-type", "application/json");
    let url = `${this.baseUri}/users/register`;
    return this.http
      .post(url, user, { headers: headers })
      .map(res => res.json());
  }

  authenticateUser(user) {
    let headers = new Headers();
    headers.append("Content-type", "application/json");
    let url = `${this.baseUri}/users/authenticate`;
    return this.http
      .post(url, user, {
        headers: headers
      })
      .map(res => res.json());
  }

  forgotPassword(user) {
    let headers = new Headers();
    headers.append("Content-type", "application/json");
    return this.http
      .post("users/forgot", user, { headers: headers })
      .map(res => res.json());
  }

  resetPassword(user) {
    let headers = new Headers();
    headers.append("Content-type", "application/json");
    return this.http
      .post(`users/reset/${user.token}`, user, {
        headers: headers
      })
      .map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem("id_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    this.authToken = localStorage.getItem("id_token");
  }

  loggedIn() {
    return tokenNotExpired("id_token");
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}