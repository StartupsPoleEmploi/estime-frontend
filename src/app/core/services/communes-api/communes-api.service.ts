import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Commune } from '@app/commun/models/commune';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommuneApiService {

  private pathApiCommunes: string;

  constructor(
    private http: HttpClient,
  ) {
    this.pathApiCommunes = 'https://geo.api.gouv.fr/communes?codePostal=';
  }

  public getCommuneFromCodePostal(codePostal: string): Observable<Commune[]> {
    return this.http.get<Array<Commune>>(`${this.pathApiCommunes}${codePostal}&fields=code`, { observe: 'body', responseType: 'json' });
  }
}

