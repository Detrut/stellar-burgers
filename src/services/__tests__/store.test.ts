import type { UnknownAction } from '@reduxjs/toolkit';
import store, { rootReducer } from '../store';

describe('rootReducer', () => {
  it('возврат корректного начального состояния для неизвестного экшена', () => {
    const initialStateFromReducer = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    } as UnknownAction);

    const initialStateFromStore = store.getState();

    expect(initialStateFromReducer).toEqual(initialStateFromStore);
  });
});
