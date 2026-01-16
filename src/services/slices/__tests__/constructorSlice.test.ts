import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  TConsturctorState,
  initialState as actualInitialState
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Булка тестовая',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 200,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const main1: TIngredient = {
  _id: 'main-1',
  name: 'Начинка 1',
  type: 'main',
  proteins: 5,
  fat: 5,
  carbohydrates: 5,
  calories: 50,
  price: 10,
  image: 'main1.png',
  image_large: 'main1-large.png',
  image_mobile: 'main1-mobile.png'
};

const main2: TIngredient = {
  _id: 'main-2',
  name: 'Начинка 2',
  type: 'main',
  proteins: 6,
  fat: 6,
  carbohydrates: 6,
  calories: 60,
  price: 20,
  image: 'main2.png',
  image_large: 'main2-large.png',
  image_mobile: 'main2-mobile.png'
};

const initialState: TConsturctorState = {
  loading: false,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

describe('burgerConstructorSlice', () => {
  it('должен возвращать начальное состояние по умолчанию', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(actualInitialState);
  });

  it('добавляет булку и заменяет предыдущую', () => {
    const stateWithBun = reducer(initialState, addIngredient(bun));

    expect(stateWithBun.constructorItems.bun).not.toBeNull();
    expect(stateWithBun.constructorItems.bun).toMatchObject({
      ...bun,
      id: expect.any(String)
    });
    expect(stateWithBun.constructorItems.ingredients).toHaveLength(0);

    const anotherBun: TIngredient = {
      ...bun,
      _id: 'bun-2',
      name: 'Другая булка'
    };
    const stateWithNewBun = reducer(stateWithBun, addIngredient(anotherBun));

    expect(stateWithNewBun.constructorItems.bun).not.toBeNull();
    expect(stateWithNewBun.constructorItems.bun?._id).toBe('bun-2');
    expect(stateWithNewBun.constructorItems.ingredients).toHaveLength(0);
  });

  it('добавляет начинку в список ингредиентов', () => {
    const stateWithMain = reducer(initialState, addIngredient(main1));

    expect(stateWithMain.constructorItems.bun).toBeNull();
    expect(stateWithMain.constructorItems.ingredients).toHaveLength(1);
    expect(stateWithMain.constructorItems.ingredients[0]).toMatchObject({
      ...main1,
      id: expect.any(String)
    });
  });

  it('удаляет ингредиент по id', () => {
    let state = reducer(initialState, addIngredient(main1));
    state = reducer(state, addIngredient(main2));

    expect(state.constructorItems.ingredients).toHaveLength(2);

    const idToRemove = state.constructorItems.ingredients[0].id;
    const stateAfterRemove = reducer(state, removeIngredient(idToRemove));

    expect(stateAfterRemove.constructorItems.ingredients).toHaveLength(1);
    expect(stateAfterRemove.constructorItems.ingredients[0].id).not.toBe(idToRemove);
  });

  it('перемещает ингредиент вниз в списке начинки', () => {
    let state = reducer(initialState, addIngredient(main1));
    state = reducer(state, addIngredient(main2));
    const main3: TIngredient = { ...main1, _id: 'main-3', name: 'Начинка 3' };
    state = reducer(state, addIngredient(main3));

    expect(state.constructorItems.ingredients).toHaveLength(3);
    const idsBefore = state.constructorItems.ingredients.map((item) => item.id);

    // Перемещаем элемент с индекса 0 на индекс 2: два раза вниз
    state = reducer(state, moveIngredientDown(0));
    state = reducer(state, moveIngredientDown(1));

    const idsAfter = state.constructorItems.ingredients.map((item) => item.id);

    expect(idsAfter).toEqual([idsBefore[1], idsBefore[2], idsBefore[0]]);
  });

  it('перемещает ингредиент вверх в списке начинки', () => {
    let state = reducer(initialState, addIngredient(main1));
    state = reducer(state, addIngredient(main2));
    const main3: TIngredient = { ...main1, _id: 'main-3', name: 'Начинка 3' };
    state = reducer(state, addIngredient(main3));

    expect(state.constructorItems.ingredients).toHaveLength(3);
    const idsBefore = state.constructorItems.ingredients.map((item) => item.id);

    // Перемещаем элемент с индекса 2 на индекс 0: два раза вверх
    state = reducer(state, moveIngredientUp(2));
    state = reducer(state, moveIngredientUp(1));

    const idsAfter = state.constructorItems.ingredients.map((item) => item.id);

    expect(idsAfter).toEqual([idsBefore[2], idsBefore[0], idsBefore[1]]);
  });

});
