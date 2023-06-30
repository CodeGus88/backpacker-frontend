import { Category } from "../category/category.dto";
import { FileDto } from "../file/file.dto";

export class TouristPlaceDto{
    uuid?: String;
    name?: String;
    imageIcon?: String;
    isPublic?: Boolean;
    resume?: String;
    description?: String;
    keywords?: String;
    createdAt?: Date;
    updatedAt?: Date;
    categories?: Category[] = [];
    files: FileDto[] = [];
    addresses: any[] = [];
}