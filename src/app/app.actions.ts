import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Users } from './reducers';

export const appActions = createActionGroup({
  source: 'App',
  events: {
    'Load Resolver': emptyProps(),
    'Load Apps': emptyProps(),
    'Load Apps Config': props<{ app: string | Users }>()
  }
});
