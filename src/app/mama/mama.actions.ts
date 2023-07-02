import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const mamaActions = createActionGroup({
  source: 'Mama',
  events: {
    'Load Mamas': emptyProps(),
    'Load Mamas Success': props<{ mama: string }>()
  }
});
