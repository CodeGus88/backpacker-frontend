import { Injectable } from '@angular/core';
import { BaseService } from './base-service.service';
import { EEntity } from '../enums/e-entity.enum';
import { HttpClient } from '@angular/common/http';
import { FileDto } from '../dtos/file/file.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService extends BaseService{

  constructor(private http: HttpClient) {
    super();
  }

  create(eEntity: EEntity, file: FormData): Observable<FileDto>{
    return this.http.post<FileDto>(`${this.apiUrl}/media/${eEntity}`, file);
  }

  delete(eEntity: EEntity, uuid: string): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/media/${eEntity}/${uuid}`);
  }

}
