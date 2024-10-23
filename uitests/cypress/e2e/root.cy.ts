import {RootViewModelStub} from "../../src/viewmodels/RootViewModel";

describe('Home', () => {
    it('passes', () => {
        Cypress.on('window:before:load', window => {
            const pages: string[] = [...Array(5).keys()]
                .map(index => {
                    return `Page ${index}`
                })

            window.rootViewModel = new RootViewModelStub(pages)
        });

        cy.visit('http://localhost:5173')

        cy.matchImageSnapshot()
    })
})