import {binding} from "cucumber-tsflow/dist/binding-decorator.js"
import {when, then} from "cucumber-tsflow/dist/step-definition-decorators.js"
import {after} from "cucumber-tsflow/dist/hook-decorators.js"

import {HomeViewModelProd} from "../../src/HomeViewModel.js";
import {type Fixture} from "../support/Fixtures.js";
import {expect} from 'chai'

@binding()
export class HomeStepDefinitions {
    @after()
    public tearDown(): void {
    }

    @when('{HomePage} is loaded')
    public givenTwoNumbers(homePageFixture: Fixture<HomeViewModelProd>): void {
        const homePage = new HomeViewModelProd()
        homePageFixture.value = homePage
    }
}