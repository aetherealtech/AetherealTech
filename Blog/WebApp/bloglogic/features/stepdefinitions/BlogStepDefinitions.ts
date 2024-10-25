import {binding} from "cucumber-tsflow/dist/binding-decorator.js"
import {when, then} from "cucumber-tsflow/dist/step-definition-decorators.js"
import {after} from "cucumber-tsflow/dist/hook-decorators.js"

import {BlogViewModelProd} from "../../src/BlogViewModel.js";
import {type Fixture} from "../support/Fixtures.js";
import {expect} from 'chai'

@binding()
export class BlogStepDefinitions {
    @after()
    public tearDown(): void {
    }

    @when('{BlogPage} is loaded')
    public givenTwoNumbers(blogPageFixture: Fixture<BlogViewModelProd>): void {
        const blogPage = new BlogViewModelProd()
        blogPageFixture.value = blogPage
    }
}