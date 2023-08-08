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

  findByEntityUuid(eEntity: EEntity, entityUuid: string): Observable<FileDto[]>{
    return this.http.get<FileDto[]>(`${this.apiUrl}/media/${eEntity}/find-by-entity-uuid/${entityUuid}`);
  }

  create(eEntity: EEntity, file: FormData): Observable<FileDto>{
    return this.http.post<FileDto>(`${this.apiUrl}/media/${eEntity}`, file);
  }

  delete(eEntity: EEntity, uuid: string): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/media/${eEntity}/${uuid}`);
  }

}
