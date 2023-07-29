import { EEntity } from "src/app/enums/e-entity.enum";
import { EModule } from "src/app/enums/e-module.enum";


export interface GalleryImage{
    src: string;
    position: number;
    alt: string;
    first: boolean;
    last: boolean;
}

export interface FileGalery{

    eModule: EModule;
    eEntity: EEntity;
    entityUuid: string;
    urlList: FileRef[];
    writePermission: boolean;

}

export interface FileRef {
    uuid: string;
    url: string;
}