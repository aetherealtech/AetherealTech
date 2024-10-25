import {binding} from "cucumber-tsflow/dist/binding-decorator.js"
import {when, then} from "cucumber-tsflow/dist/step-definition-decorators.js"
import {after} from "cucumber-tsflow/dist/hook-decorators.js"

import {ContactViewModelProd} from "../../src/ContactViewModel.js";
import {type Fixture} from "../support/Fixtures.js";
import {expect} from 'chai'

@binding()
export class ContactStepDefinitions {
    @after()
    public tearDown(): void {
    }

    @when('{ContactPage} is loaded')
    public givenTwoNumbers(contactPageFixture: Fixture<ContactViewModelProd>): void {
        const contactPage = new ContactViewModelProd()
        contactPageFixture.value = contactPage
    }
}