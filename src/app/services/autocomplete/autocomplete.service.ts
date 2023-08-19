import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TPAutocomplete } from 'src/app/constants/tp-autocomplete';

@Injectable({
  providedIn: 'root'
})
export class TPAutocompleteService{

  private subject: BehaviorSubject<TPAutocomplete[]> = new BehaviorSubject<TPAutocomplete[]>([]);
  public static readonly tpAutoComplete: TPAutocomplete[] = [
    {
    letter: 'CATEGORÍAS',
    names: [
      'Cultural', 
      'Religioso', 
      'Gastronómico', 
      'Idiomático', 
      'Salud o wellness', 
      'Deportivo', 
      'Parque temático', 
      'Negocio', 
      'Ecoturismo',
      'Aventura',
      'Rural',
      'Paranormal'
    ]}
  ];

  constructor() { }

  private generateAutoCompleteList(){
    
    this.subject.next(this.tpAutoComplete);
  }

  getAutocompleteList(): Observable<TPAutocomplete[]>{
    this.generateAutoCompleteList();
    return this.subject.asObservable();
  }

}
