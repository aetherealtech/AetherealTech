import {binding} from "cucumber-tsflow/dist/binding-decorator.js"
import {when, then} from "cucumber-tsflow/dist/step-definition-decorators.js"
import {after} from "cucumber-tsflow/dist/hook-decorators.js"

import {type PageContent, RootViewModelProd} from "../../src/RootViewModel.js";
import {Subscription} from "rxjs";
import {type Fixture} from "../support/Fixtures.js";
import {expect} from 'chai'

declare module "rxjs" {
    interface Subscription {
        store(subscriptions: Set<Subscription>): void
    }
}

Subscription.prototype.store = function(subscriptions: Set<Subscription>) {
    subscriptions.add(this)
}

@binding()
export class RootStepDefinitions {
    private readonly currentPage = new Map<RootViewModelProd, PageContent | null>()
    private readonly subscriptions = new Set<Subscription>()

    @after()
    public tearDown(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe())
        this.subscriptions.clear()
    }

    @when('{App} is loaded with path {string}')
    public givenTwoNumbers(appFixture: Fixture<RootViewModelProd>, path: string): void {
        const app = new RootViewModelProd(path);

        app.content
            .subscribe((page) => {
                this.currentPage.set(app, page);
            })
            .store(this.subscriptions)

        appFixture.value = app
    }

    @then('{App} content is Home Page')
    public thenResultReceived(appFixture: Fixture<RootViewModelProd>): void {
        const currentPage = this.currentPage.get(appFixture.value)
        expect(currentPage.type).to.equal("home")
    }
}