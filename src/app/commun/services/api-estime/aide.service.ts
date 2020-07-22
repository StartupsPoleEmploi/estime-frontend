import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aide } from '@models/aide.model';
import { Environment } from '@models/environment.model';

@Injectable({
  providedIn: 'root'
})
export class AideService {

  private pathAideService: string;

  constructor(
    private http: HttpClient,
    private environment: Environment) {

    this.pathAideService = this.environment.apiEstimeURL + 'aides';
  }

  public getAides(): Observable<Array<Aide>> {
    return this.http.get<Array<Aide>>(this.pathAideService);
  }
}
