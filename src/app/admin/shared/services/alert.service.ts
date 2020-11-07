import { Subject } from 'rxjs';
import { Injectable } from "@angular/core";

export type AlertType = 'success' | 'error' | 'warning';

export interface Alert {
  type: AlertType
  text: string
}

@Injectable()
export class AlertService {
  public alert$ = new Subject<Alert>()

  success(text: string) {
    this.alert$.next({type: 'success', text})
  }

  warning(text: string) {
    this.alert$.next({type: 'warning', text})
  }

  error(text: string) {
    this.alert$.next({type: 'error', text})
  }
}
