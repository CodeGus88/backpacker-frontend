import { Component, Input } from '@angular/core';
import { FileDto } from 'src/app/dtos/file/file.dto';
import { EEntity } from 'src/app/enums/e-entity.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent {

  @Input() eEntity?: EEntity;
  @Input() file?: FileDto;

  getImageUrl(){
    return `${environment.mediaPartialUrl}/${this.eEntity?.toLowerCase()}/${this.file?.entityUuid}/${this.file?.file}`;
  }

}
