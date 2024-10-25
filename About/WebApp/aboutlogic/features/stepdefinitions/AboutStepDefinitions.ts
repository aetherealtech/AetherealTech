import {binding} from "cucumber-tsflow/dist/binding-decorator.js"
import {when, then} from "cucumber-tsflow/dist/step-definition-decorators.js"
import {after} from "cucumber-tsflow/dist/hook-decorators.js"

import {AboutViewModelProd} from "../../src/AboutViewModel.js";
import {type Fixture} from "../support/Fixtures.js";
import {expect} from 'chai'

@binding()
export class AboutStepDefinitions {
    @after()
    public tearDown(): void {
    }

    @when('{AboutPage} is loaded')
    public givenTwoNumbers(aboutPageFixture: Fixture<AboutViewModelProd>): void {
        const aboutPage = new AboutViewModelProd()
        aboutPageFixture.value = aboutPage
    }
}