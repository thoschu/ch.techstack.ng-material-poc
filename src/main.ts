import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => console.log('Bootstrap success'))
  .catch((err: Error) => console.error(err));
