import { Component } from '@angular/core';
import { Paginate } from 'src/app/dtos/paginable.dto';
import { TouristPlaceItem } from 'src/app/dtos/touristplace/item.dto';
import { TouristPlaceService } from '../../../services/tourist-place/tourist-place.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, debounceTime, fromEvent, map } from 'rxjs';
import { PaginableDataInput } from 'src/app/dtos/paginable-data-input.dto';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { EOrder } from 'src/app/enums/e.order.enum';
import { EEntity } from 'src/app/enums/e-entity.enum';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list',
  templateUrl: './tourist-place.component.html',
  styleUrls: ['./tourist-place.component.scss', './tourist-place.component.css']
})
export class TouristPlaceComponent {

  protected paginate: Paginate;
  protected totalPages: number;
  protected list: TouristPlaceItem[];
  protected ASC: EOrder = EOrder.ASC;
  protected DESC: EOrder = EOrder.DESC;

  // Order options
  protected options: any[]; // opciones de filtro

  constructor(
    private touristPlaceService: TouristPlaceService,
    private matSnackBar: MatSnackBar,
    private router: Router
  ) {
    this.paginate = new Paginate(0, 8, 0, 'rating,createdAt', EOrder.DESC, '');
    this.list = [];
    // options init
    this.options = [
      {value: 'name', viewValue: 'Nombre'},
      {value: 'createdAt', viewValue: 'Fecha de creación'},
      {value: 'rating,createdAt', viewValue: 'Rating'}
    ];
    this.totalPages = 0;
  }

  ngOnInit() {
    this.loadTable(this.touristPlaceService.findAll(this.paginate));
    // searcher event
    const search = document.getElementById('search');
    const keyup = fromEvent(search!, 'keyup');
    keyup.pipe(
      map((e: any) => e.currentTarget.value),
      debounceTime(800)
    ).subscribe({
      next: text => {
        this.filterKeyPreset(text);
      }
    });
  }

  filterKeyPreset(text: string): void {
    this.paginate.filter = text;
    this.paginate.page = 0;
    this.loadTable(this.touristPlaceService.findAll(this.paginate));
  }

  onLoadData(): void {
    this.loadTable(this.touristPlaceService.findAll(this.paginate));
  }

  loadTable(obs: Observable<PaginableDataInput<TouristPlaceItem>>): void {
    obs.subscribe({
      next: data => {
        console.log(data);
        this.paginate.size = data.size;
        this.paginate.totalElements = data.totalElements;
        this.paginate.page = data.pageable.pageNumber;
        this.list = data.content ?? [];
        this.totalPages = data.totalPages;
      },
      error: e => {
        this.matSnackBar.open("Algo salió mal", "ERROR", {duration: 3000});
        console.log(e)
      }
    });
  }

  /**
   * Write code on Method
   *
   * @return response()
   */
  pageChangeEvent(event: number) {
    this.paginate.page = event - 1;
    this.loadTable(this.touristPlaceService.findAll(this.paginate));
  }

  redirectTo(url: string){
    this.router.navigate([url]);
  }

  protected getImageUrl(parentUuid?: String, imageIcon?: String): String {
    if (imageIcon)
      return `${environment.mediaPartialUrl}/${EEntity.TOURIST_PLACE_FILES}/${parentUuid}/${imageIcon}`;
    else
      return `${environment.mediaPartialUrl}/${EEntity.TOURIST_PLACE_FILES}/defaultImageIcon.png`;
  }

  getCategoryList(categories: String = ""): string[] {
    return categories ? categories.split(',') : [];
  }

  pageChanged($event: PageEvent): void{
    console.log($event);
    this.paginate.totalElements = $event.length;
    this.paginate.page = $event.pageIndex;
    this.paginate.size = $event.pageSize;
    this.onLoadData();
  }

  getPagesList(): number []{
    let array: number[] = [];
    for (let index = 1; index <= this.totalPages; index++)
      array.push(index)
    return array;
  }

  goToPageNumber(){
    this.onLoadData();
  }

}