import { Injectable } from '@angular/core';
import { BaseService } from '../base-service.service';
import { HttpClient } from '@angular/common/http';
import { RatingDto } from 'src/app/dtos/rating/rating.dto';
import { Observable } from 'rxjs';
import { ERating } from 'src/app/enums/rating.enum';
import { RatingItem } from 'src/app/dtos/rating/item.dto';

@Injectable({
  providedIn: 'root'
})
export class RatingService extends BaseService {

  constructor(private http: HttpClient) {
    super();
  }

  public  findByEntityUuid(eRating: ERating, entityUuid: string, limit: number): Observable<RatingDto>{
      return this.http.get<RatingDto>(`${this.apiUrl}/${eRating}/${entityUuid}/${limit}`);
  }

  public findByEntityUuidAndAuthUserUuid(eRating: ERating, entityUuid: string): Observable<RatingItem>{
    return this.http.get<RatingItem>(`${this.apiUrl}/${eRating}/this-auth-user/${entityUuid}`);
  }

  public create(eRating: ERating, request: FormData): Observable<RatingItem>{
    return this.http.post<RatingItem>(`${this.apiUrl}/${eRating}`, request);
  }

  public update(eRating: ERating, uuid: string, request: FormData): Observable<RatingItem>{
    return this.http.put<RatingItem>(`${this.apiUrl}/${eRating}/${uuid}`, request);
  }

  public deleteByUuid(eRating: ERating, uuid: string): Observable<boolean>{
    return this.http.delete<boolean>(`${this.apiUrl}/${eRating}/${uuid}`); 
  }

  public punctuationByentityUuid(eRating: ERating, entityUuid: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/${eRating}/punctuation/${entityUuid}`);
  }

}
