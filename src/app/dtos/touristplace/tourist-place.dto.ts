import { AddressDto } from "../address/address.dto";
import { Category } from "../category/category.dto";

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
    addresses: AddressDto[] = [];
}