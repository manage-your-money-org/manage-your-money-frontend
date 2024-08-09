import {HttpHeaders} from "@angular/common/http";
import {v4 as uuidv4} from 'uuid';


export class MymUtil {

  public static getHeaders() {

    return new HttpHeaders()
      .append('correlation-id', uuidv4())
  }

  public static isEmailIdValid(email: string) {

    let emailReg: RegExp = /[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}/;

    return this.isStringValid(email) && emailReg.test(email);
  }

  public static isPasswordValid(password: string): boolean {

    let passReg: RegExp = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/;
    return passReg.test(password);
  }

  public static isStringValid(str: string): boolean {

    return str != null && str.trim() !== '' && str.trim().trim() !== 'null';
  }

}
