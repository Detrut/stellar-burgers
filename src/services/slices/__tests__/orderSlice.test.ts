import orderSlice, { initialState, fetchOrderByNumber } from '../orderSlice';

describe('тестирование редьюсера orderSlice', () => {
  describe('тестирование асинхронного POST экшена fetchOrderByNumber', () => {
    const actions = {
      pending: {
        type: fetchOrderByNumber.pending.type,
        payload: null
      },
      rejected: {
        type: fetchOrderByNumber.rejected.type,
        error: { message: 'error. fetch order by number rejected' }
      },
      fulfilled: {
        type: fetchOrderByNumber.fulfilled.type,
        payload: { orders: ['someOrder'] }
      }
    };

    test('тест синхронного экшена fetchOrderByNumber.pending', () => {
      const nextState = orderSlice(initialState, actions.pending);
      expect(nextState.request).toBe(true);
      expect(nextState.error).toBe(actions.pending.payload);
    });
    test('тест синхронного экшена fetchOrderByNumber.rejected', () => {
      const nextState = orderSlice(initialState, actions.rejected);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(actions.rejected.error.message);
    });
    test('тест синхронного экшена fetchOrderByNumber.fulfilled', () => {
      const nextState = orderSlice(initialState, actions.fulfilled);
      expect(nextState.request).toBe(false);
      expect(nextState.error).toBe(null);
      expect(nextState.orderByNumberResponse).toBe(
        actions.fulfilled.payload.orders[0]
      );
    });
  });
});
