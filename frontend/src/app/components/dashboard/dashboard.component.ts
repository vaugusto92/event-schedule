import { Component, OnInit } from "@angular/core";
import { EventsService } from "../../services/events.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { Event } from "../../models/event";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  event = new Event();
  events: Event[] = [];
  isEditing = false;

  constructor(
    private eventsService: EventsService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.populateEvents();
  }

  populateEvents() {
    this.eventsService.listEvents().subscribe(data => {
      this.events = data;
    });
  }

  updateEvent(event) {
    this.eventsService.updateEvent(event).subscribe(
      () => {
        this.event = event;
      },
      error => console.log(error)
    );
    this.isEditing = false;
    this.flashMessage.show("Event successfully edited!", {
      cssClass: "alert-success",
      timeout: 2000
    });
  }

  deleteEvent(event) {
    // if (window.confirm('Are you sure you want to permanently delete this item?')) {
    //   this.eventsService.deleteEvent(event).subscribe(
    //     () => {
    //       const pos = this.events.map(elem => elem._id).indexOf(event._id);
    //       this.events.splice(pos, 1);
    //       this.flashMessage.show('Event successfully edited!', {
    //         cssClass: 'alert-success', timeout: 2000
    //       });
    //     },
    //     error => console.log(error)
    //   );
    // }
  }

  enableEditing(event) {
    this.isEditing = true;
    this.event = event;
  }

  cancelEditing() {
    this.isEditing = false;
    this.event = new Event();
    this.flashMessage.show("Editing cancelled.", {
      cssClass: "alert-warning",
      timeout: 2000
    });
    this.populateEvents();
  }
}
