import {binding} from "cucumber-tsflow/dist/binding-decorator.js"
import {given, then, when} from "cucumber-tsflow/dist/step-definition-decorators.js"
import {after} from "cucumber-tsflow/dist/hook-decorators.js"

import {
    type AboutPageContent,
    type BlogPageContent,
    type ContactPageContent,
    type HomePageContent,
    type Page,
    type PageContent,
    PageRoute,
    RootViewModelProd
} from "../../src/RootViewModel.js"

import {type AboutViewModel} from "aboutlogic";
import {type BlogViewModel} from "bloglogic";
import {type ContactViewModel} from "contactlogic";
import {type HomeViewModel} from "homelogic";
import {Subscription} from "rxjs";
import {type Fixture} from "../support/Fixtures.js";
import {expect} from 'chai'
import * as TypeMoq from "typemoq";
import {FakeBrowser} from '../support/FakeBrowser.js'

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

    @given('{App} is loaded with path {TextValue}')
    public givenAppIsLoadedWithPath(appFixture: Fixture<RootViewModelProd>, path: string): void {
        appFixture.value = this.loadApp({ path: path })
    }

    @given('{App} is loaded with pages {ListOfPages}')
    public givenAppIsLoadedWithPages(appFixture: Fixture<RootViewModelProd>, pagesFixture: Fixture<PageRoute[]>): void {
        appFixture.value = this.loadApp({ pages: pagesFixture.value })
    }

    @given('Path {Text} of {Page}')
    public givenPathOfPage(pathFixture: Fixture<string>, pageFixture: Fixture<PageRoute>): void {
        pathFixture.value = pageFixture.value.route
    }

    @then('{App} content should be Home Page')
    public thenAppContentShouldBeHomePage(appFixture: Fixture<RootViewModelProd>): void {
        const currentPage = this.currentPage.get(appFixture.value)
        expect(currentPage?.type).to.equal("home")
    }

    @given('{Browser}')
    public givenBrowser(browserFixture: Fixture<FakeBrowser>): void {
        browserFixture.value = FakeBrowser.instance
    }

    @given('Any {Text}')
    public givenAnyText(textFixture: Fixture<string>): void {
        textFixture.value = randomString()
    }

    @given('Any {Page}')
    public givenAnyPage(pageFixture: Fixture<PageRoute>): void {
        pageFixture.value = this.createPageRouteDescriptor()
    }

    @given('{PageMenuItem} for {Page} in {App}')
    public givenPageMenuItemForPage(
        pageMenuItemFixture: Fixture<Page>,
        pageFixture: Fixture<PageRoute>,
        appFixture: Fixture<RootViewModelProd>
    ): void {
        pageMenuItemFixture.value = appFixture.value
            .pages
            .find(page => page.label == pageFixture.value.label)
    }

    @when('{PageMenuItem} is selected')
    public whenPageMenuItemIsSelected(pageMenuItemFixture: Fixture<Page>): void {
        pageMenuItemFixture.value.select()
    }

    @given('{App} content is {Page}')
    public givenAppContentIsPage(appFixture: Fixture<RootViewModelProd>, pageFixture: Fixture<PageRoute>): void {
        pageFixture.value = this.createPageRouteDescriptor()
        this.currentPage.set(appFixture.value, pageFixture.value.contentFactory())
    }

    @given('{Browser} previous path is {TextValue}')
    public givenBrowserPreviousPathIs(browserFixture: Fixture<FakeBrowser>, previousPath: string): void {
        browserFixture.value.setHistory([previousPath])
    }

    @given('Any {ListOfPages}')
    public givenAnyListOfPages(pagesFixture: Fixture<PageRoute[]>): void {
        pagesFixture.value = new Array(randomInt(4, 8)).fill(null)
            .map(_ => this.createPageRouteDescriptor())
    }

    @given('Any {Page} in {ListOfPages}')
    public givenAnyPageInListOfPages(pageFixture: Fixture<PageRoute>, pagesFixture: Fixture<PageRoute[]>): void {
        pageFixture.value = pagesFixture.value[randomInt(pagesFixture.value.length)]
    }

    @when('{Browser} pops state')
    public whenBrowserPopsState(browserFixture: Fixture<FakeBrowser>): void {
        browserFixture.value.window.history.back()
    }

    @then('{App} content should be {Page}')
    public thenAppContentIsPage(appFixture: Fixture<RootViewModelProd>, pageFixture: Fixture<PageRoute>): void {
        const currentPage = this.currentPage.get(appFixture.value)
        expect(currentPage.type).to.equal(pageFixture.value.contentFactory().type)
    }

    @then('{Browser} path should be {TextValue}')
    public thenBrowserPathShouldBe(browserFixture: Fixture<FakeBrowser>, expectedPath: string): void {
        expect(browserFixture.value.document.location.pathname).to.equal(expectedPath)
    }

    private loadApp(params: { path?: string, pages?: PageRoute[] }) {
        const pages = params.pages ?? RootViewModelProd.defaultPages()
        const path = params.path ?? ""

        const app = new RootViewModelProd(
            path,
            pages
        )

        app.content
            .subscribe((page) => {
                this.currentPage.set(app, page);
            })
            .store(this.subscriptions)

        return app
    }

    private createPage(): PageContent {
        switch (randomInt(4)) {
            case 0: return this.createHomePage()
            case 1: return this.createAboutPage()
            case 2: return this.createContactPage()
            default: return this.createBlogPage()
        }
    }

    private createPageRouteDescriptor(): PageRoute {
        const page = this.createPage()

        return new PageRoute(
            randomString(),
            `/${randomString()}`,
            () => page
        )
    }

    private createHomePage(): HomePageContent {
        return {
            type: "home",
            content: TypeMoq.Mock.ofType<HomeViewModel>().object
        }
    }

    private createAboutPage(): AboutPageContent {
        return {
            type: "about",
            content: TypeMoq.Mock.ofType<AboutViewModel>().object
        }
    }

    private createContactPage(): ContactPageContent {
        return {
            type: "contact",
            content: TypeMoq.Mock.ofType<ContactViewModel>().object
        }
    }

    private createBlogPage(): BlogPageContent {
        return {
            type: "blog",
            content: TypeMoq.Mock.ofType<BlogViewModel>().object
        }
    }
}

function randomInt(firstBound: number, secondBound?: number): number {
    const min = secondBound !== undefined ? firstBound : 0
    const max = secondBound !== undefined ? secondBound : firstBound
    return min + Math.floor(Math.random() * (max - min - 1))
}

function randomString(length: number = randomInt(5, 20)): string {
    const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result: string = ""
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return result
}