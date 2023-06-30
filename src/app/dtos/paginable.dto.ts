import { EOrder } from "../enums/e.order.enum";

export class Paginate{

    page: number; // página
    size: number; // número de elementos por página
    totalElements: number; // total elementos
    sort: string; // Orden
    ascDesc: EOrder; // Acendente (asc - desc)
    filter: string;
    
    constructor(page: number, size: number, totalElements: number, sort: string, ascDesc: EOrder, filter: string){
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.sort = sort;
        this.ascDesc = ascDesc;
        this.filter = filter;
    }

}