/// <reference types="cypress" />

const MODAL_CONTAINER = '#modals';
const MODAL = '#modals > div:first-child';
const MODAL_TITLE = '#modals h3';
const MODAL_CLOSE = '#modals button';
const MODAL_OVERLAY = '#modals > div:last-child';

const INGREDIENT_BUN_NAME = 'Краторная булка N-200i';
const SELECT_FILLING_TEXT = 'Выберите начинку';
const INGREDIENT_LIST_ITEM = 'li';
const ADD_BUTTON_TEXT = 'Добавить';

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
  });

  it('добавляет булочку в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.contains(INGREDIENT_BUN_NAME)
      .closest(INGREDIENT_LIST_ITEM)
      .contains(ADD_BUTTON_TEXT)
      .click();

    cy.contains(`${INGREDIENT_BUN_NAME} (верх)`).should('exist');
    cy.contains(`${INGREDIENT_BUN_NAME} (низ)`).should('exist');

    cy.contains('Выберите булки').should('not.exist');
  });

  it('добавить начинку в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains(SELECT_FILLING_TEXT).should('exist');
    cy.contains('Соус Spicy-X').closest(INGREDIENT_LIST_ITEM).contains(ADD_BUTTON_TEXT).click();
    cy.contains(SELECT_FILLING_TEXT).should('not.exist');
  });

  describe('модальное окно ингредиента', () => {
    it('открыть и показать свойства ингредиента', () => {
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.contains(INGREDIENT_BUN_NAME).click();
      cy.get(MODAL_CONTAINER).should('not.be.empty');
      cy.get(MODAL).should('be.visible');
      cy.get(MODAL_TITLE)
        .should('be.visible')
        .and('contain.text', 'Детали ингредиента');

      cy.get(MODAL).within(() => {
        cy.contains(INGREDIENT_BUN_NAME).should('be.visible');
        cy.contains('Калории, ккал').should('be.visible');
      });
    });

    it('закрытие по крестику', () => {
      cy.visit('/');
      cy.wait('@getIngredients');

      cy.contains(INGREDIENT_BUN_NAME).click();
      cy.get(MODAL_CONTAINER).should('not.be.empty');
      cy.get(MODAL).should('be.visible');
      cy.get(MODAL_CLOSE).click();
      cy.get(MODAL_CONTAINER).should('be.empty');
    });

    it('закрывается по оверлею', () => {
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.contains(INGREDIENT_BUN_NAME).click();
      cy.get(MODAL_CONTAINER).should('not.be.empty');
      cy.get(MODAL).should('be.visible');
      cy.get(MODAL_OVERLAY).click({ force: true });
      cy.get(MODAL_CONTAINER).should('be.empty');
    });

    it('закрывается по Escape', () => {
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.contains(INGREDIENT_BUN_NAME).click();
      cy.get(MODAL_CONTAINER).should('not.be.empty');
      cy.get(MODAL).should('be.visible');
      cy.get('body').type('{esc}');
      cy.get(MODAL_CONTAINER).should('be.empty');
    });
  });

  describe('создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as(
        'getUser'
      );
      cy.intercept('POST', '**/orders', { fixture: 'orderResponse.json' }).as(
        'createOrder'
      );
      cy.setCookie('accessToken', 'test-access-token');
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });

      cy.wait('@getUser');
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
    });

    it('сборка бургера, оформление заказа', () => {
      cy.contains(INGREDIENT_BUN_NAME)
        .closest(INGREDIENT_LIST_ITEM)
        .contains(ADD_BUTTON_TEXT)
        .click();

      cy.contains('Соус Spicy-X').closest(INGREDIENT_LIST_ITEM).contains(ADD_BUTTON_TEXT).click();
      cy.contains(SELECT_FILLING_TEXT).should('not.exist');
      cy.contains('button', 'Оформить заказ').click();

      cy.wait('@createOrder');

      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('11325').should('be.visible');

      cy.get(MODAL_CONTAINER).within(() => {
        cy.get('button').click();
      });

      cy.contains('идентификатор заказа').should('not.exist');

      cy.contains('Выберите булки').should('be.visible');
      cy.contains(SELECT_FILLING_TEXT).should('be.visible');
    });
  });
});
