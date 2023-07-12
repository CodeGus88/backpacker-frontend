import { Component, Input, SimpleChanges } from '@angular/core';
import { AddressDto } from 'src/app/dtos/address/address.dto';

// Map
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Overlay } from 'ol';

@Component({
  selector: 'app-address-read-only',
  templateUrl: './address-read-only.component.html',
  styleUrls: ['./address-read-only.component.css']
})
export class AddressReadOnlyComponent {

  @Input('addresses') addresses?: AddressDto[];

  // map
  private map: Map | undefined;
  private markerSource: VectorSource | undefined;

  constructor() {

    console.log("contructor", this.addresses)

  }

  ngOnInit(): void {
    // paso 5
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 8
      })
    });

    // paso 6

    this.markerSource = new VectorSource();

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 25],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        // opacity: 0.96,
        opacity: 1,
        src: 'assets/map/ubicacion.png'
      })
    });

    // paso 7
    let markerLayer = new VectorLayer({
      source: this.markerSource,
      style: markerStyle
    });
    this.map.addLayer(markerLayer);

    // Agregar marcadores
    this.addMarkers();
  }

  addMarkers(): void {
    this.addresses?.forEach(item => {
      // console.log(":(", item)
      let marker = new Feature({
        geometry: new Point(fromLonLat([item.lng, item.lat]))
      });
      this.markerSource!.addFeature(marker);
      
      // Crear un elemento HTML para mostrar el título del marcador
      let titleElement = document.createElement('div');
      titleElement.innerHTML = `<small>${item.title}</small>`;
      titleElement.className = 'markertitle';
      titleElement.style.backgroundColor = 'white';
      titleElement.style.marginLeft = '10px';
      titleElement.style.paddingLeft = '5px';
      titleElement.style.paddingRight = '5px';
      titleElement.style.borderTopRightRadius = '10px';
      titleElement.style.borderTopLeftRadius = '10px';
      titleElement.style.borderBottomRightRadius = '10px';
      titleElement.style.borderBottomLeftRadius = '10px';

      // Crear una superposición para mostrar el título del marcador
      let titleOverlay = new Overlay({
        element: titleElement,
        position: fromLonLat([item.lng, item.lat]),
        positioning: 'bottom-left',
        // positioning: 'bottom-center',
        // offset: [0, 45]
      });
      this.map!.addOverlay(titleOverlay);
    })

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(":)", this.addresses);
    // this.map.updateSize();
    if (this.addresses)
      if (this.addresses.length > 0) {
        this.setCenter(this.addresses[0].lng, this.addresses[0].lat, 1000);
        this.setZoom(14, 1000);
      }
    this.addMarkers();
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

  getGoogleLink(addressDto: AddressDto): string {
    return `https://maps.google.com/?q=${addressDto.lat},${addressDto.lng}`;
  }

  getGoogleEarth(addressDto: AddressDto): string {
    return `https://earth.google.com/web/@${addressDto.lat},${addressDto.lng}`;
  }
}

