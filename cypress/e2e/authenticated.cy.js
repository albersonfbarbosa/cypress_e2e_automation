import { faker } from '@faker-js/faker/locale/en'

describe('Scenarios where authentication is a pre-condition', () => {
  //executa antes de cada teste. Isso torna os testes idependentes
  beforeEach(() => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.sessionLogin()
  })

  it('CRUDs a note', () => {
    const noteDescription = faker.lorem.words(4)

    cy.createNote(noteDescription)
    cy.wait('@getNotes')
    //cria 4 palavras aleatórias usando o faker
    const updatedNoteDescription = faker.lorem.words(4)
    const attachFile = true

    cy.editNote(noteDescription, updatedNoteDescription, attachFile)
    cy.wait('@getNotes')

    cy.deleteNote(updatedNoteDescription)
    cy.wait('@getNotes')
  })

  //o .only executa apenas este teste
  it('successfully submits the settings form', () => {
    cy.intercept('POST', '**/prod/billing').as('paymentRequest')
    //comando customizável
    cy.fillSettingsFormAndSubmit()

    cy.wait('@getNotes')
    cy.wait('@paymentRequest')
      .its('state')
      .should('be.equal', 'Complete')
  })

  it('logs out', () => {
    cy.visit('/')
    cy.wait('@getNotes')
    //devido a responsividade, abaixo de 768 aparece um botão de menu anterior para clicar em logout
    if (Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')) {
      cy.get('.navbar-toggle.collapsed')
        .should('be.visible')
        .click()
    }    
    cy.contains('.nav a', 'Logout').click()
    cy.get('#email').should('be.visible')
  })
})
