import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressDto } from 'src/app/dtos/address/address.dto';
import { environment } from 'src/environments/environment';
import { EEntity } from '../../enums/e-entity.enum';
import { AddressRequest } from '../../dtos/address/address-request.dto';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) { }

  findAllByEntityUuuid(eEntity: EEntity, entityUuid: string){
    return this.http.get<AddressDto[]>(`${this.api}/${eEntity}/${entityUuid}`);
  }

  create(eEntity: EEntity, request: AddressRequest){
    return this.http.post<AddressDto>(`${this.api}/${eEntity}`, request);
  }

  update(eEntity: EEntity, uuid: string, request: AddressRequest){
    return this.http.put<AddressDto>(`${this.api}/${eEntity}/${uuid}`, request);
  }

  deleteByUuid(eEntity: EEntity, uuid: string){
    return this.http.delete<boolean>(`${this.api}/${eEntity}/${uuid}`);
  }

}
