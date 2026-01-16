/// <reference types="cypress" />

const MODAL_CONTAINER = '#modals';
const MODAL = '#modals > div:first-child';
const MODAL_TITLE = '#modals h3';
const MODAL_CLOSE = '#modals button';
const MODAL_OVERLAY = '#modals > div:last-child';

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
  });

  it('добавляет булочку в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.contains('Краторная булка N-200i')
      .closest('li')
      .contains('Добавить')
      .click();

    cy.contains('Краторная булка N-200i (верх)').should('exist');
    cy.contains('Краторная булка N-200i (низ)').should('exist');

    cy.contains('Выберите булки').should('not.exist');
  });

  it('добавить начинку в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.contains('Выберите начинку').should('exist');
    cy.contains('Соус Spicy-X').closest('li').contains('Добавить').click();
    cy.contains('Выберите начинку').should('not.exist');
  });

  describe('модальное окно ингредиента', () => {
    it('открыть и показать свойства ингредиента', () => {
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.contains('Краторная булка N-200i').click();
      cy.get(MODAL_CONTAINER).should('not.be.empty');
      cy.get(MODAL).should('be.visible');
      cy.get(MODAL_TITLE)
        .should('be.visible')
        .and('contain.text', 'Детали ингредиента');

      cy.get(MODAL).within(() => {
        cy.contains('Краторная булка N-200i').should('be.visible');
        cy.contains('Калории, ккал').should('be.visible');
      });
    });

    it('закрытие по крестику', () => {
      cy.visit('/');
      cy.wait('@getIngredients');

      cy.contains('Краторная булка N-200i').click();
      cy.get(MODAL_CONTAINER).should('not.be.empty');
      cy.get(MODAL).should('be.visible');
      cy.get(MODAL_CLOSE).click();
      cy.get(MODAL_CONTAINER).should('be.empty');
    });

    it('закрывается по оверлею', () => {
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.contains('Краторная булка N-200i').click();
      cy.get(MODAL_CONTAINER).should('not.be.empty');
      cy.get(MODAL).should('be.visible');
      cy.get(MODAL_OVERLAY).click({ force: true });
      cy.get(MODAL_CONTAINER).should('be.empty');
    });

    it('закрывается по Escape', () => {
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.contains('Краторная булка N-200i').click();
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
      cy.contains('Краторная булка N-200i')
        .closest('li')
        .contains('Добавить')
        .click();

      cy.contains('Соус Spicy-X').closest('li').contains('Добавить').click();
      cy.contains('Выберите начинку').should('not.exist');
      cy.contains('button', 'Оформить заказ').click();

      cy.wait('@createOrder');

      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('11325').should('be.visible');

      cy.get(MODAL_CONTAINER).within(() => {
        cy.get('button').click();
      });

      cy.contains('идентификатор заказа').should('not.exist');

      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
});
