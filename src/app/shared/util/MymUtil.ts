import {HttpHeaders} from "@angular/common/http";
import crypto from "crypto";

export class MymUtil {

  public static getHeaders() {

    return new HttpHeaders({
      'correlation-id': crypto.randomUUID().toString()
    });
  }
}
