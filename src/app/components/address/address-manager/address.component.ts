import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Collection, Feature } from 'ol';
import Map from 'ol/Map'; import View from 'ol/View';
import { Translate } from 'ol/interaction';
import { Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { MapService } from 'src/app/services/map/map.service';
import { AddressRequest } from '../../../dtos/address/address-request.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddressService } from 'src/app/services/address/address.service';
import { EEntity } from 'src/app/enums/e-entity.enum';
import { EVerb } from 'src/app/enums/e-verbs.enum';
import { AddressDto } from 'src/app/dtos/address/address.dto';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../confirm-dialog.component';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent {

  @ViewChild('modalx') modalx!: ElementRef;
  @ViewChild('btnClose') btnClose!: ElementRef;

  @Input() eEntity!: EEntity;
  @Input() entityUuid!: string;
  @Input() addresses: AddressDto[] | undefined;
  private map?: Map;
  private fuente: VectorSource;
  private marker: Feature;
  protected request: AddressRequest;
  protected editableFlag: boolean;
  protected eVerb = EVerb;
  protected editableUuid?: string | undefined;

  protected seeker: string;

  constructor(
    private mapService: MapService,
    private addressService: AddressService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.fuente = new VectorSource();
    this.marker = new Feature();
    this.request = new AddressRequest();
    this.editableFlag = false;
    this.editableUuid = '';
    this.seeker = '';
  }

  ngAfterViewInit() {
    this.modalx.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.editOrCreateTrigger();
    });
  }

  ngOnInit(): void {
    this.refreshAddresses();
    this.map = new Map({
      target: 'editorMap',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 5
      })
    });

    this.map.on('click', (evento) => {
      let coordenadas = toLonLat(evento.coordinate);
      this.request.lng = coordenadas[0];
      this.request.lat = coordenadas[1];
      this.map!.removeOverlay;
      this.createMarker(this.request.lng, this.request.lat);
      this.setCenter(this.request.lng, this.request.lat, 0);
    });
    this.search();
  }

  editOrCreateTrigger(addressDto?: AddressDto) {
    if (addressDto) {
      this.editableFlag = true;
      this.editableUuid = addressDto.uuid;
      this.request.title = addressDto.title;
      this.request.address = addressDto.address;
      this.request.continent = addressDto.continent;
      this.request.country = addressDto.country;
      this.request.state = addressDto.state;
      this.request.county = addressDto.county;
      this.request.entityUuid = this.entityUuid;
      this.request.lng = addressDto.lng;
      this.request.lat = addressDto.lat;
    } else {
      this.editableFlag = false;
      this.editableUuid = undefined;
      this.request.title = '';
      this.request.address = '';
      this.request.continent = ''
      this.request.country = '';
      this.request.state = '';
      this.request.county = '';
      this.request.entityUuid = '';
      this.request.lng = 0;
      this.request.lat = 0;
    }
    this.createMarker(this.request.lng, this.request.lat);
    this.setCenter(this.request.lng, this.request.lat, 1000);
  }

  search(search: string = this.request.address): void {
    if (!search)
      return;
    this.mapService.find(search).subscribe({
      next: data => {
        if (data.results.length > 0) {
          this.request.lat = data.results[0].geometry.lat;
          this.request.lng = data.results[0].geometry.lng;
          // Crea un marcador y agrégale un icono
          this.createMarker(this.request.lng, this.request.lat);
          this.setCenter(this.request.lng, this.request.lat, 2000);
        }else{
          this.snackBar.open("No se encontraron coinsidencias para la búsqueda", 'SIN RESULTADOS', { duration: 3000})
        }
      },
      error: error => {
        console.log(error);
      }
    });
  }

  createMarker(lng: number, lat: number) {
    this.fuente.clear();
    this.marker.setGeometry(new Point(fromLonLat([lng, lat])));
    this.fuente.addFeature(this.marker);
    let capa = new VectorLayer({
      source: this.fuente
    });
    this.map!.addLayer(capa);

    let translate = new Translate({
      features: new Collection([this.marker])
    });
    this.map!.addInteraction(translate);

    translate.on('translateend', (evento) => {
      let coordenadas = toLonLat(evento.coordinate);
      this.request.lng = coordenadas[0];
      this.request.lat = coordenadas[1];
    });
  }

  setCenter(lon: number, lat: number, duration: number) {
    let coordenadas = fromLonLat([lon, lat]);
    this.map!.getView().animate({
      center: coordenadas,
      duration: duration
    });
  }

  setZoom(zoom: number, duration: number) {
    this.map!.getView().animate({
      zoom: zoom,
      duration: duration
    });
  }

  save(eVerb: EVerb) {
    if (this.request.lng && this.request.lat)
      this.mapService.find(`${this.request.lat}, ${this.request.lng}`).subscribe({
        next: data => {
          if (data.results.length > 0) {
            this.request.continent = data.results[0].components.continent;
            this.request.country = data.results[0].components.country;
            this.request.state = data.results[0].components.state;
            this.request.county = data.results[0].components.county;
            this.request.entityUuid = this.entityUuid;
            if (!this.request.title)
              this.snackBar.open("Título requerido", 'INCONSISTENTE', { duration: 3000});
            else if (!this.request.address)
              this.snackBar.open("La dirección es requerida", 'INCONSISTENTE', { duration: 3000});
            else if (eVerb == EVerb.CREATE) {
              this.addressService.create(this.eEntity, this.request).subscribe({
                next: data => {
                  console.log(data);
                  this.snackBar.open("Se registró correctamente", 'ÉXITO', { duration: 3000});
                  this.btnClose.nativeElement.click();
                  this.refreshAddresses();
                },
                error: error => {
                  console.log(error)
                }
              });
            } else if (eVerb == EVerb.UPDATE) {
              if (!this.editableUuid) {
                this.snackBar.open("uuid requerido", 'INCONSISTENTE', { duration: 3000});
                return;
              }
              this.addressService.update(this.eEntity, this.editableUuid, this.request).subscribe({
                next: data => {
                  console.log(data);
                  this.snackBar.open("Se actualizó correctamente", 'OK', { duration: 3000});
                  this.btnClose.nativeElement.click();
                  this.refreshAddresses();
                },
                error: error => {
                  this.snackBar.open(`No se pudo actualizar el recurso ${error.status}`, 'ERROR', { duration: 3000});
                }
              });
            }
          }
          console.log(data);
        },
        error: error => {
          console.log(error);
        }
      });
    else
      this.snackBar.open("Debes marcar una ubicacíon en el mapa", 'INCONSISTENTE', { panelClass: ['z-10000'] });
  }

  refreshAddresses(): void {
    this.addressService.findAllByEntityUuuid(this.eEntity, this.entityUuid).subscribe({
      next: data => {
        this.addresses = data;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  deleteByUuid(uuid: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'CONFIRMACIÓN',
        content: '¿Estás seguro de eliminar esta dirección?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addressService.deleteByUuid(this.eEntity, uuid).subscribe({
          next: data => {
            this.snackBar.open("El recurso se eliminó correctamente", 'OK', { duration: 3000})
            this.refreshAddresses();
          },
          error: error => {
            console.log(error);
            this.snackBar.open(`Error al intentar eliminar el recurso ${error.status}`, 'ERROR', { duration: 3000})
          }
        });
      }
    });
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.request.lat = position.coords.latitude;
        this.request.lng = position.coords.longitude;
        this.setCenter(this.request.lng, this.request.lat, 1000);
        this.setZoom(12, 1000);
      });
    } else {
      this.request.lat = 0;
      this.request.lng = 0;
      this.setCenter(this.request.lng, this.request.lat, 1000);
      this.setZoom(5, 1000);
      alert("Geolocalización no es soportada por este navegador.");
    }
  }

}

