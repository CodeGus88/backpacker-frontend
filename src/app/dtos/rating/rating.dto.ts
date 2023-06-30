import { RatingItem } from "./item.dto";

export class RatingDto{
    punctuation?: number = 0;
    population?: number = 0;
    entityUuid?: string = '';
    items: RatingItem[] = [];
}