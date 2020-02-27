import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs";

import { User } from "../models/user";

@Injectable()
export class UsersService {
  baseUri: string = "http://localhost:8080/users";

  constructor(private http: Http, private httpClient: HttpClient) {}

  // List all users
  listUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUri}/list`);
  }
}
