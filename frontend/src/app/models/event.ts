import { Invitation } from "./invitation";

export class Event {
  _id?: string;
  description?: string;
  start?: Date;
  end?: Date;
  createdBy?: string;
  invitations?: [Invitation];
}