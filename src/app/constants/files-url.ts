import { environment } from "src/environments/environment";
import { EEntity } from "../enums/e-entity.enum";

export class FileUrlGenerator{

    static getImageUrl(eEntity: EEntity, entityUuid: string, file?: String): string {
        return `${environment.mediaPartialUrl}/${eEntity}/${entityUuid}/${file}`;
    }
  
    static getDefaultImgUrl(eEntity: EEntity): string{
      return `${environment.mediaPartialUrl}/${eEntity}/defaultImageIcon.png`;
    }
  

}