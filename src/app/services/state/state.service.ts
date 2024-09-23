import {Injectable} from '@angular/core';
import {State} from "../../constants/request-state";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public state: State = State.INIT;

  public get isStateProcessing(): boolean {
    return this.state === State.PROCESSING;
  }

  public get isStateSearching(): boolean {
    return this.state === State.SEARCHING;
  }

  public setRequestState(state: State): void {
    this.state = state;
  }
}
