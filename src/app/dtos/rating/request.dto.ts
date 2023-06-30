export class RatingRequest{
    
    punctuation: number;
    comment: string;
    entityUuid?: string;

    constructor(entityUuid: string){
        this.punctuation = 0;
        this.comment = '';
        this.entityUuid = entityUuid;
    }
}