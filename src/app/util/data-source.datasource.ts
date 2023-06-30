import { TouristPlaceItem } from "../models/touristplace/item.model";

import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Subject, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TouristplaceService } from '../services/touristplace/touristplace.service';
import { Paginable } from "../models/paginable.model";

/**
 * Sin utilizarce en ningún lugar por el momennto
 * Sirve para la autopaginación con scroll virtual
 */

export class ItemDataSource extends DataSource<TouristPlaceItem | undefined>{

    private itemsInMemory: TouristPlaceItem[] = Array.from<TouristPlaceItem>({length: 0});//[];
    // private itemsChanges$: BehaviorSubject<TouristPlaceItem[]>;
    private itemsChanges$ = new BehaviorSubject<TouristPlaceItem[]>(this.itemsInMemory);
    private destroy$: Subject<boolean> = new Subject();

    // Paginado automático
    private size = 50; // Elementos a mostrar
    private paged = 0; // pagina a mostrar

    private touristplaceService: TouristplaceService

    // Borrar 
    private readonly _subscription = new Subscription();

    constructor(touristplaceService: TouristplaceService){
        super();
        this.touristplaceService = touristplaceService;
        // this.itemsChanges$ = new BehaviorSubject(this.itemsInMemory);
        this.getInformation();
    }

    connect(collectionViewer: CollectionViewer): Observable<readonly TouristPlaceItem[]>{ 
        collectionViewer.viewChange
        .pipe(takeUntil(this.destroy$))
        .subscribe((range) => {
            const currentPage = Math.floor(range.end / this.size);
            console.log("this.page: " + this.paged + "  currentPage: " + currentPage)
            if(currentPage > this.paged){
                this.paged = currentPage;
                // obtener información
                this.getInformation();
            }
        });
        console.log(this.itemsChanges$);
        return this.itemsChanges$;
    }

    disconnect(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    getInformation() {
        this.touristplaceService.getPaginableList(new Paginable(this.paged, this.size, 'createdAt', true)).subscribe(
            {
                next: (data) => {
                    this.itemsInMemory = [
                        ...this.itemsInMemory,
                        ...data.content??[]
                    ];
                    console.log(this.itemsInMemory);
                    this.itemsChanges$.next(this.itemsInMemory);
                },
                error: (e) => {
                    console.log(e.message);
                }
            }
        );
    }
}