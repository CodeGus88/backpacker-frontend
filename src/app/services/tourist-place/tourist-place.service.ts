import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Paginate } from '../../dtos/paginable.dto';
import { Observable } from 'rxjs';
import { TouristPlaceItem } from '../../dtos/touristplace/item.dto';
import { PaginableDataInput } from 'src/app/dtos/paginable-data-input.dto';
import { Request } from 'src/app/dtos/touristplace/request.dto';
import { TouristPlaceDto } from 'src/app/dtos/touristplace/tourist-place.dto';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TouristPlaceService {

  constructor(private http: HttpClient) { }

  findAll(paginate: Paginate): Observable<PaginableDataInput<TouristPlaceItem>> {
    return this.http.get<PaginableDataInput<TouristPlaceItem>>(
      `${environment.apiUrl}/tourist-places`,
      {
        params:
        {
          filter: paginate.filter,
          page: paginate.page,
          size: paginate.size,
          sort: `${paginate.sort},${paginate.ascDesc}`,
        }
      }
    );
  }

  findById(uuid: String = ''): Observable<TouristPlaceDto> {
    return this.http.get<TouristPlaceDto>(`${environment.apiUrl}/tourist-places/${uuid}`).pipe();
  }

  deleteByUuid(uuid: String) {
    return this.http.delete<boolean>(`${environment.apiUrl}/tourist-places/${uuid}`).pipe();
  }

  // create(request: Request): Observable<TouristPlaceDto> {
  create(request: any): Observable<TouristPlaceDto> {
    return this.http.post<TouristPlaceDto>(`${environment.apiUrl}/tourist-places/create`, request);
  }

  // update(uuid?: String, request?: Request): Observable<TouristPlaceDto> {
  update(uuid?: String, request?: any): Observable<TouristPlaceDto> {
    return this.http.put<TouristPlaceDto>(`${environment.apiUrl}/tourist-places/update/${uuid}`, request);
  }

  updateImageIcon(data: FormData): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/tourist-places/update/image-icon`, data);
  }

  removeImageIcon(uuid: String, imageIcon: String): Observable<TouristPlaceDto> {
    let formData = new FormData();
    formData.append("uuid", uuid.toString());
    formData.append("imageIcon", imageIcon.toString());
    return this.http.patch<TouristPlaceDto>(`${environment.apiUrl}/tourist-places/remove/image-icon`, formData);
  }

}



