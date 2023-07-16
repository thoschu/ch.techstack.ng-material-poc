import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const MainActions = createActionGroup({
  source: 'Main',
  events: {
    'Load Mains': emptyProps(),
  },
});
