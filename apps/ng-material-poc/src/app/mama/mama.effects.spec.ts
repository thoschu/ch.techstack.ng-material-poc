import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { MamaEffects } from './mama.effects';

describe('MamaEffects', () => {
  let actions$: Observable<any>;
  let effects: MamaEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MamaEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(MamaEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
