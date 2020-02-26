import { Injectable } from "@angular/core";

@Injectable()
export class ValidateService {
  constructor() {}

  static validateRegister(user) {
    return !(
      user.name == undefined ||
      user.email == undefined ||
      user.username == undefined ||
      user.password == undefined
    );
  }

  static validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  static validateUserLogin(user) {
    if (user.username == undefined || user.password == undefined) {
      return false;
    } else {
      return true;
    }
  }
}