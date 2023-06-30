import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FileDto } from "src/app/dtos/file/file.dto";
import { EEntity } from '../../enums/e-entity.enum';

@Injectable({
    providedIn: 'root'
  })
export class GaleryService{
  
    constructor(private http: HttpClient) { }

    upload(eEntity: EEntity, data: FormData): Observable<FileDto>{
      return this.http.post<FileDto>(`${environment.apiUrl}/media/${eEntity.toLowerCase()}/upload`, data);
    }

    findByUuid(eEntity: EEntity, uuid: string): Observable<FileDto>{
      return this.http.get<FileDto>(`${environment.apiUrl}/media/${eEntity.toLowerCase()}/${uuid}`);
    }

    deleteByUuid(eEntity: EEntity, fileUuid: string){
      return this.http.delete<boolean>(`${environment.apiUrl}/media/${eEntity.toLowerCase()}/${fileUuid}`);
    }

    findByEntityUuid(eEntity: EEntity, entityUuid: string): Observable<FileDto[]>{
      return this.http.get<FileDto[]>(`${environment.apiUrl}/media/${eEntity.toLowerCase()}/find-all-by-entity-uuid/${entityUuid}`);
    }
    
}