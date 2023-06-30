import { Component } from '@angular/core';
import { Paginate } from 'src/app/dtos/paginable.dto';
import { TouristPlaceItem } from 'src/app/dtos/touristplace/item.dto';
import { TouristPlaceService } from '../../../services/tourist-place/tourist-place.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, fromEvent, map } from 'rxjs';
import { PaginableDataInput } from 'src/app/dtos/paginable-data-input.dto';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { EOrder } from 'src/app/enums/e.order.enum';
import { EEntity } from 'src/app/enums/e-entity.enum';

@Component({
  selector: 'app-list',
  templateUrl: './tourist-place.component.html',
  styleUrls: ['./tourist-place.component.scss', './tourist-place.component.css']
})
export class TouristPlaceComponent {

  protected paginate: Paginate;
  protected list: TouristPlaceItem[];
  protected ASC: EOrder = EOrder.ASC;
  protected DESC: EOrder = EOrder.DESC;


  constructor(
    private touristPlaceService: TouristPlaceService,
    private toast: ToastrService,
    private router: Router
  ) {
    this.paginate = new Paginate(0, 8, 0, 'rating,createdAt', EOrder.DESC, '');
    this.list = [];
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
      },
      error: e => {
        this.toast.warning("Algo salio mal", "Error");
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

  view(uuid?: String): void {
    this.router.navigate(['tourist-places/view/' + uuid]);
  }

  protected getImageUrl(parentUuid?: String, imageIcon?: String): String {
    if (imageIcon)
      return `${environment.mediaPartialUrl}/${EEntity.TOURIST_PLACE_FILES.toLowerCase()}/${parentUuid}/${imageIcon}`;
    else
      return `${environment.mediaPartialUrl}/${EEntity.TOURIST_PLACE_FILES.toLowerCase()}/defaultImageIcon.png`;
  }

  getCategoryList(categories: String = "") {
    return categories ? categories.split(',') : [];
  }

}
