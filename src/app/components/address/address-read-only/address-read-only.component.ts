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



@Component({
  selector: 'app-address-read-only',
  templateUrl: './address-read-only.component.html',
  styleUrls: ['./address-read-only.component.css']
})
export class AddressReadOnlyComponent {

  @Input() addresses: AddressDto[] | undefined;

  // map
  private map: Map;
  private markerSource: VectorSource;

  constructor() {

    // paso 5
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([-17.3843056, -66.135]),
        zoom: 8
      })
    });

    // paso 6

    this.markerSource = new VectorSource();

    const markerStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 0.75,
        src: 'assets/map/marker.png'
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

  addMarkers(): void{
    this.addresses?.forEach(item => {
      let marker = new Feature({
        geometry: new Point(fromLonLat([item.lng, item.lat]))
      });
      this.markerSource.addFeature(marker);
    })
    
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log(":)", this.addresses);
  // }

  ngAfterViewInit() {
    this.map.updateSize();
  }

  getGoogleLink(addressDto: AddressDto): string{
    return `https://maps.google.com/?q=${addressDto.lat},${addressDto.lng}`;
  }

  getGoogleEarth(addressDto: AddressDto): string{
    return `https://earth.google.com/web/@${addressDto.lat},${addressDto.lng}`;
  }
}

