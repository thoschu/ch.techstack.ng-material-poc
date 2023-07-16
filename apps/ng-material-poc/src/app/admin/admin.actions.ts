import {
  ActionCreator,
  ActionCreatorProps,
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import {
  Creator,
  FunctionWithParametersType,
  NotAllowedCheck,
  TypedAction,
} from '@ngrx/store/src/models';

import { Admin } from './admin.model';

type EventCreator<
  PropsCreator extends ActionCreatorProps<unknown> | Creator,
  Type extends string
> = PropsCreator extends ActionCreatorProps<infer Props>
  ? void extends Props
    ? ActionCreator<Type, () => TypedAction<Type>>
    : ActionCreator<
        Type,
        (
          props: Props & NotAllowedCheck<Props & object>
        ) => Props & TypedAction<Type>
      >
  : PropsCreator extends Creator<infer Props, infer Result>
  ? FunctionWithParametersType<
      Props,
      Result & NotAllowedCheck<Result> & TypedAction<Type>
    > &
      TypedAction<Type>
  : never;
type Join<
  Str extends string,
  Separator extends string = ' '
> = Str extends `${infer First}${Separator}${infer Rest}`
  ? Join<`${First}${Rest}`, Separator>
  : Str;
type CapitalizeWords<Str extends string> =
  Str extends `${infer First} ${infer Rest}`
    ? `${Capitalize<First>} ${CapitalizeWords<Rest>}`
    : Capitalize<Str>;
type ActionName<EventName extends string> = Uncapitalize<
  Join<CapitalizeWords<EventName>>
>;
type ActionGroup<
  Source extends string,
  Events extends Record<string, ActionCreatorProps<unknown> | Creator>
> = {
  [EventName in keyof Events as ActionName<EventName & string>]: EventCreator<
    Events[EventName],
    `[${Source}] ${EventName & string}`
  >;
};

export const setAdminActionCreator: ActionCreator<
  '[Admin Page] SetAdmin Action',
  (props: {
    admin: Admin<number>;
  }) => { admin: Admin<number> } & TypedAction<'[Admin Page] SetAdmin Action'>
> = createAction(
  '[Admin Page] SetAdmin Action',
  props<{ admin: Admin<number> }>()
);

export const adminActions: ActionGroup<
  'Admin Page',
  {
    'DeleteAdmin Action': ActionCreatorProps<void>;
    'SetAdmin Action': ActionCreatorProps<{ admin: Admin<number> }>;
  }
> = createActionGroup({
  source: 'Admin Page',
  events: {
    'DeleteAdmin Action': emptyProps(),
    'SetAdmin Action': props<{ admin: Admin<number> }>(),
  },
});
