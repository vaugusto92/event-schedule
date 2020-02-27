import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { HttpClient } from "@angular/common/http"
import "rxjs/add/operator/map";
import { Observable } from "rxjs";

import { Event } from "../models/event";

@Injectable()
export class EventsService {
  baseUri: string = "http://localhost:8080/events";

  constructor(private http: Http, private httpClient: HttpClient) {}

  // Create event
  createEvent(event) {
    let headers = new Headers();
    headers.append("Content-type", "application/json");

    const options = new RequestOptions({ headers: headers });

    let url = `${this.baseUri}/create`;
    return this.http.post(url, event, options).map(res => res.json());
  }

  // List all events
  listEvents(): Observable<Event[]> {
    return this.httpClient.get<Event[]>(`${this.baseUri}/list`);
  }
  
  listInvitedEvents(user): Observable<Event[]> {
    let url = `${this.baseUri}/list/${user.id}`
    return this.httpClient.get<Event[]>(url);
  }

  updateEvent(event) {
    let headers = new Headers();
    let url = `${this.baseUri}/update/${event._id}`;
    return this.httpClient.put(url, event);
  }

  deleteEvent(event): Observable<any> {
    let url = `${this.baseUri}/delete/${event._id}`;
    return this.httpClient.delete(url, event);
  }
}
