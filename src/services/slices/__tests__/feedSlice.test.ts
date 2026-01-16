import feedSlice, { fetchFeeds, initialState } from '../feedSlice';

describe('тестирование редьюсера feedSlice', () => {
  describe('тестирование асинхронного GET экшена fetchFeeds', () => {
    const actions = {
      pending: {
        type: fetchFeeds.pending.type,
        payload: null
      },
      rejected: {
        type: fetchFeeds.rejected.type,
        payload: 'error. fetch rejected'
      },
      fulfilled: {
        type: fetchFeeds.fulfilled.type,
        payload: { orders: ['order1', 'order2'] }
      }
    };

    test('тест синхронного экшена fetchFeeds.pending', () => {
      const state = feedSlice(initialState, actions.pending);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(actions.pending.payload);
    });

    test('тест синхронного экшена fetchFeeds.rejected', () => {
      const state = feedSlice(initialState, actions.rejected);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(actions.rejected.payload);
    });

    test('тест синхронного экшена fetchFeeds.fulfilled', () => {
      const nextState = feedSlice(initialState, actions.fulfilled);
      expect(nextState.isLoading).toBe(false);
      expect(nextState.orders).toEqual(actions.fulfilled.payload.orders);
    });
  });
});
