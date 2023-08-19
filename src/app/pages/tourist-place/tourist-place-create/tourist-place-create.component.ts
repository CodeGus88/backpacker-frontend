import { Component } from '@angular/core';
import { TouristPlaceService } from 'src/app/services/tourist-place/tourist-place.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category/category.service';
import { Category } from 'src/app/dtos/category/category.dto';
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
    const value = control.value;
    if (!Array.isArray(value) || value.length === 0 || value.length > 3)
      return { multiSelect: true };
    return null;
  }

  ngOnInit() {
    this.categoryService.findAll().subscribe({
      next: data => {
        this.categories = data;
      },
      error: e => {
        this.snackBar.open("No se pudieron cargar las categorías", "ERROR", {duration: 3000})
        console.log(e.message);
      }
    });
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

  backHistory(){
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
