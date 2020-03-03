import { Component, OnInit } from "@angular/core";
import { EventsService } from "../../services/events.service";
import { FlashMessagesService } from "angular2-flash-messages";
import { AuthService } from '../../services/auth.service';
import { UsersService } from "../../services/users.service";


import { Router } from "@angular/router";

import { Event } from "../../models/event";
import { User } from "../../models/user";
import { Invitation } from "../../models/invitation";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  event = new Event();
  events: Event[] = [];

  invitations: Invitation[] = [];
  invitedEvents: Event[] = [];
  
  user;
  users: User[] = [];
  invitedUsers: Boolean[] = [];

  isEditing = false;

  constructor(
    private eventsService: EventsService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.isEditing = false;
    this.loadUser();
    this.populateEvents();
    this.populateInvitedEvents();
  }

  /**
   * General use methods.
   */

  loadUser() {
    this.user = JSON.parse(this.authService.retrieveUser());
  }

  enableEditing(event) {
    this.isEditing = true;
    this.event = event;
    this.populateUsers();
    this.populateInvitedEvents();
  }
  
  cancelEditing() {
    this.isEditing = false;
    this.event = new Event();
    this.flashMessage.show("Editing cancelled.", {
      cssClass: "alert-warning",
      timeout: 2000
    });
    this.populateEvents();
    this.populateInvitedEvents();
  }

  /**
   * Event-related methods.
   */

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
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.eventsService.deleteEvent(event).subscribe(
        () => {
          const pos = this.events.map(elem => elem._id).indexOf(event._id);
          this.events.splice(pos, 1);
        },
        error => console.log(error)
      );
    }

    this.flashMessage.show('Event successfully deleted!', {
      cssClass: 'alert-success', timeout: 2000
    });
    this.populateEvents();
    this.populateInvitedEvents();
    this.router.navigate(["/dashboard"]);
  }

  /**
   * Invitation-related methods.
   */

  populateInvitedEvents() {
    this.eventsService.listInvitedEvents(this.user).subscribe(data => {
      this.invitedEvents = data;
    });
  }

  findByUserId(invitations, userId) {
    var index = invitations.map(function(element) {
      return element.id
    }).indexOf(userId)

    return invitations[index]
  }
  
  acceptInvitation(event) {
    this.manageInvitation(event, true);
  }
  
  rejectInvitation(event) {
    this.manageInvitation(event, false);
  }

  manageInvitation(event, decision) {
    var index = this.findInvitation(event);
    
    if (index != -1) {
      event.invitations[index]['accepted'] = decision;
      this.updateEvent(event);
    }
  }
  
  findInvitation(event) {
    for (let i = 0; i < event.invitations.length; i++) {
      if (event.invitations[i]['userId'] === this.user.id) {
        return i;
      }
    }
    
    return -1;
  }
  
  getEventStatus(event) {
    var index = this.findInvitation(event);
    var status;

    if (index != -1) {
      status = event.invitations[index]['accepted']
    }

    if (status == null) {
      return 'NO ANSWER'
    } 

    return status === true ? 'ACCEPTED' : 'REJECTED';
 }

  populateUsers() {
    this.usersService.listUsers().subscribe(data => {
      this.users = data;
    });
  }

  inviteUser(user) {
    const invitation = {
      userId: user._id,
      accepted: null,
    };
    
    this.event['invitations'].push(invitation);
    this.manageInvitation(user);
  }

  notInvited(user) {
    const index = this.users.indexOf(user);
    return this.invitedUsers[index] == true ? false : true;
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
}
