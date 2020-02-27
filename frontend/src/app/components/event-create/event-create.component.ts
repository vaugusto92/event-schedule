import { Component, OnInit } from "@angular/core";
import { EventsService } from "../../services/events.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { Event } from "../../models/event";
import { Router } from "@angular/router";
import * as moment from 'moment';

@Component({
  selector: "app-event-create",
  templateUrl: "./event-create.component.html",
  styleUrls: ["./event-create.component.css"]
})
export class EventCreateComponent implements OnInit {
  description: String;
  start: Date;
  end: Date;

  events: Event[] = [];

  constructor(
    private eventsService: EventsService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.populateEvents();
  }

  populateEvents() {
    this.eventsService.listEvents().subscribe(data => {
      this.events = data;
    });
  }

  validateEventCreation(event) {
    for (let i = 0; i < this.events.length; i++) {
      const start = this.events[i].start;
      const end = this.events[i].end;
      const isBetween = moment(event.start).isBetween(start, end, null, '()');
      if (isBetween) {
        return false;
      }
    }

    return true;
  }

  onEventCreateSubmit() {
    const event = {
      description: this.description,
      start: this.start,
      end: this.end
    };

    const valid = this.validateEventCreation(event);

    if (!valid) {
      this.router.navigate(["/dashboard"]);
      this.flashMessage.show("There is already a event within those days.", {
        cssClass: "alert-danger text-center",
        timeout: 3000
      });

      return;
    }

    // persist event
    this.eventsService.createEvent(event).subscribe(data => {
      if (data.success) {
        this.flashMessage.show("Event successfully created!", {
          cssClass: "alert-success text-center",
          timeout: 3000
        });
        this.router.navigate(["/dashboard"]);
      } else {
        this.flashMessage.show(data.msg, {
          cssClass: "alert-danger text-center",
          timeout: 3000
        });
        this.router.navigate(["/dashboard"]);
      }
    });
  }
}
