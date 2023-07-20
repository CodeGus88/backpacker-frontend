import { Component } from '@angular/core';
import { TouristPlaceService } from 'src/app/services/tourist-place/tourist-place.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/categoriy/category.service';
import { Category } from 'src/app/dtos/category/category.dto';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-tourist-place-create',
  templateUrl: './tourist-place-create.component.html',
  styleUrls: ['./tourist-place-create.component.css']
})
export class TouristPlaceCreateComponent {

  // protected request: Request;
  protected title: string = "Nuevo";
  protected errors: any[];
  protected categories: Category[];

  // Multiselect
  protected dropdownList: any[] = [];
  protected selectedItems: any[] = [];
  protected dropdownSettings: IDropdownSettings = {};

  protected form = this.fb.group({
    name: ['', [Validators.minLength(2), Validators.maxLength(35)]],
    // imageIcon: [''],
    isPublic: [false, []],
    categories: [[], [Validators.required, this.multiSelectValidator]],
    resume: ['', [Validators.minLength(10), Validators.maxLength(500)]],
    keywords: ['', [Validators.minLength(1), Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10000)]]
  });

  constructor(
    private touristPlaceService: TouristPlaceService,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.errors = [];
    this.categories = [];
  }

  multiSelectValidator(control: FormControl) {
    // Obtener el valor del control
    const value = control.value;
    // Validar que el valor sea un array y que tenga al menos un elemento seleccionado
    if (!Array.isArray(value) || value.length === 0 || value.length > 3) {
      // Si la validación falla, devolver un objeto de errores
      return { multiSelect: true };
    }
    // Si la validación pasa, devolver null
    return null;
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
      this.touristPlaceService.create(this.form.value).subscribe({
      next: data => {
        console.log(data);
        this.snackBar.open("Se creó correctamente", "OK", {duration: 3000})
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

  onSubmit(){
    this.create();
  }

  // para el select multiple
  getLength(){
    let array = this.form.controls.categories.value??[];
    return array.length;
  }

  getArray(): any[]{
    return this.form.controls.categories.value??[];
  }

  existInArray(option: any){
    return this.getArray().includes(option);
  }
  
}
