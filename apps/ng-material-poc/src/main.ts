import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { isDevMode, NgModuleRef } from '@angular/core';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((appModuleRef: NgModuleRef<AppModule>): void | null =>
    isDevMode() ? console.dir(appModuleRef) : null
  )
  .catch((err: Error) => console.error(err));
