import { Component, OnInit } from "@angular/core";
import { EventsService } from "../../services/events.service";
import { AuthService } from "app/services/auth.service";
import { UsersService } from "../../services/users.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { User } from "../../models/user";
import { Router } from "@angular/router";
import * as moment from 'moment';

import { Event } from "../../models/event";
import { Invitation } from "../../models/invitation";

@Component({
  selector: "app-event-create",
  templateUrl: "./event-create.component.html",
  styleUrls: ["./event-create.component.css"]
})
export class EventCreateComponent implements OnInit {
  description: String;
  start: Date;
  end: Date;
  invitations: Invitation[] = [];
  
  user;

  events: Event[] = [];
  users: User[] = [];
  invitedUsers: Boolean[] = [];
  user_count;

  constructor(
    private eventsService: EventsService,
    private authService: AuthService,
    private usersService: UsersService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.populateEvents();
    this.populateUsers();
    this.loadUser();
  }

  loadUser() {
    this.user = JSON.parse(this.authService.retrieveUser());
  }

  populateEvents() {
    this.eventsService.listEvents().subscribe(data => {
      this.events = data;
    });
  }
  
  populateUsers() {
    this.usersService.listUsers().subscribe(data => {
      this.users = data;
    });
  }

  manageInvitation(user) {
    const index = this.users.indexOf(user);
    this.invitedUsers[index] = true;
  }

  loadInvitations() {
    if (this.invitedUsers.length == 0) {
      const length = this.users.length;
      this.invitedUsers = Array(length).fill(false);
    }
  }

  validateEventCreation(event) {
    if (this.events.length == 0) {
      return true;
    }

    for (let i = 0; i < this.events.length; i++) {
      const start = this.events[i].start;
      const end = this.events[i].end;
      const isBetween = moment(event.start).isBetween(start, end, 'hours', '()');
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
      end: this.end,
      createdBy: this.user.name,
      invitations: this.invitations,
    };

    const valid = this.validateEventCreation(event);
    
    if (!valid) {
      this.router.navigate(["/dashboard"]);
      this.flashMessage.show("There is already an event within those days.", {
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

  inviteUser(user) {
    this.loadInvitations();

    const invitation = {
      userId: user._id,
      accepted: null,
    };

    this.invitations.push(invitation);
    this.manageInvitation(user);
  }

  notInvited(user) {
    const index = this.users.indexOf(user);
    return this.invitedUsers[index] == true ? false : true;
  }
}
