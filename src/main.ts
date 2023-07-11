/// <reference types="node" />
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { IgcRatingComponent, defineComponents } from 'igniteui-webcomponents';



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

defineComponents(IgcRatingComponent); // Agregar rating


