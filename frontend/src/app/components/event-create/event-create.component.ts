import { Component, OnInit } from "@angular/core";
import { EventsService } from "../../services/events.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { Router } from "@angular/router";

@Component({
  selector: "app-event-create",
  templateUrl: "./event-create.component.html",
  styleUrls: ["./event-create.component.css"]
})
export class EventCreateComponent implements OnInit {
  description: String;
  start: Date;
  end: Date;

  constructor(
    private eventsService: EventsService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) {}

  ngOnInit() {}

  onEventCreateSubmit() {
    const event = {
      description: this.description,
      start: this.start,
      end: this.end
    };

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
