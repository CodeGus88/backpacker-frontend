import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private url = `https://api.opencagedata.com/geocode/v1/json?q=$search&key=b357f12dbbb843ffb3f7b4f381bffbad`;

  constructor(private http: HttpClient) { }

  find(search: string): Observable<any>{
    return this.http.get<any>(this.url.replaceAll('$search', search));
  }

}
