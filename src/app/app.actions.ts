import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const appActions = createActionGroup({
  source: 'App',
  events: {
    'Load Apps': emptyProps(),
  }
});
