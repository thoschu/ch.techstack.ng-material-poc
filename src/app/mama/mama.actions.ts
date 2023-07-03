import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const mamaActions = createActionGroup({
  source: 'Mama',
  events: {
    'Load Mamas Delete': emptyProps(),
    'Load Mamas Success': props<{ mama: string }>()
  }
});
