import { Component } from '@angular/core';
import { Request } from 'src/app/dtos/touristplace/request.dto';
import { TouristPlaceService } from 'src/app/services/tourist-place/tourist-place.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/categoriy/category.service';
import { Category } from 'src/app/dtos/category/category.dto';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-tourist-place-create',
  templateUrl: './tourist-place-create.component.html',
  styleUrls: ['./tourist-place-create.component.css']
})
export class TouristPlaceCreateComponent {

  protected request: Request;
  protected errors: any[];
  protected categories: Category[];

  // Multiselect
  protected dropdownList: any[] = [];
  protected selectedItems: any[] = [];
  protected dropdownSettings: IDropdownSettings = {};

  constructor(
    private touristPlaceService: TouristPlaceService,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService
  ) {
    this.request = new Request();
    this.request.isPublic = true;
    this.errors = [];
    this.categories = [];
  }
  ngOnInit() {
    this.categoryService.findAll().subscribe({
      next: data => {
        this.multiSelectInit(data);
        this.categories = data;
      },
      error: e => {
        this.snackBar.open("No se pudieron cargar las categorías", "ERROR", {duration: 3000})
        console.log(e.message);
      }
    });

  }

  multiSelectInit(data: any){
    console.log(data);
    this.dropdownList = data;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true,
      limitSelection: 3
    };
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }

  create(): void {
    let selectedCategories = this.selectedItems.map(e => {return {id: e.id}});
    this.request.categories = selectedCategories;
    console.log(this.request);
    this.touristPlaceService.create(this.request).subscribe({
      next: data => {
        console.log(data);
        window.history.back();
      },
      error: e => {
        this.errors = e.error.errors;
        console.log(e);
        this.snackBar.open("Algo salió mal", "ERROR");
      }
    });
  }

  ngBack(){
    window.history.back();
  }
  
}
