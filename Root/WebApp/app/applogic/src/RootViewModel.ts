import { type HomeViewModel, HomeViewModelProd } from "homelogic";
import { type AboutViewModel, AboutViewModelProd } from "aboutlogic";
import { type ContactViewModel, ContactViewModelProd } from "contactlogic";
import { type BlogViewModel, BlogViewModelProd } from "bloglogic";
import { Subject, type Observable, fromEvent, map, merge, mergeWith, of, tap, EMPTY } from "rxjs";

export type HomePageContent = {
    type: "home"
    content: HomeViewModel
}

export type AboutPageContent = {
    type: "about"
    content: AboutViewModel
}

export type ContactPageContent = {
    type: "contact"
    content: ContactViewModel
}

export type BlogPageContent = {
    type: "blog"
    content: BlogViewModel
}

export type PageContent = HomePageContent | AboutPageContent | ContactPageContent | BlogPageContent

export abstract class Page {
    abstract label: string
    readonly selectEvents = new Subject<void>()

    select(): void {
        this.selectEvents.next()
    }
}

export type RootViewModel = {
    pages: Page[]
    content: Observable<PageContent | null>
}

export class PageRoute extends Page {
    constructor(
        label: string,
        route: string,
        contentFactory: () => PageContent
    ) {
        super()

        this.label = label
        this.route = route
        this.contentFactory = contentFactory
    }

    label: string
    route: string
    contentFactory: () => PageContent
}

export class RootViewModelProd implements RootViewModel {
    public readonly pages: Page[]
    public readonly content: Observable<PageContent | null>

    public constructor(
        path: string,
        pages: PageRoute[] = RootViewModelProd.defaultPages()
    ) {
        this.pages = pages

        const pageSelections = merge(
            ...pages.map(page => {
                return page.selectEvents.pipe(
                    tap({ next: () => window.history.pushState({}, "", page.route) }),
                    map(() => page.contentFactory)
                )
            })
        )

        const pathUpdates = window !== undefined ? fromEvent(
            window,
            'popstate',
            _ => document.location.pathname
        ) : EMPTY

        // Building the content observable this way is for the specific purpose of tying the subscription to the window popstate events
        // to the subscription to the content.  The view is who subscribes to the content.  Until the view does so, there's no reason to
        // listen to popstate events.  Similarly, once the view tears down its subscription, that is the appropriate time to unsubscribe
        // from the popstate events.  This all happens automatically by subscribing and then cancelling the subscription to the content,
        // because the content is an observable derived from the pathUpdates observable.
        this.content = of(path)
            .pipe(
                mergeWith(pathUpdates),
                map(path => {
                    const route = pages
                        .find((page) => page.route == path)

                    if(route == undefined)
                        return null

                    return route.contentFactory
                }),
                mergeWith(pageSelections),
                map(contentFactory => contentFactory?.())
            )
    }

    public static defaultPages() {
        const homePage = new PageRoute(
            "Home",
            "/",
            () => ({type: "home", content: new HomeViewModelProd()})
        )

        const aboutPage = new PageRoute(
            "About",
            "/about",
            () => ({type: "about", content: new AboutViewModelProd()})
        )

        const contactPage = new PageRoute(
            "Contact",
            "/contact",
            () => ({type: "contact", content: new ContactViewModelProd()})
        )

        const blogPage = new PageRoute(
            "Blog",
            "/blog",
            () => ({type: "blog", content: new BlogViewModelProd()})
        )

        return [
            homePage,
            aboutPage,
            contactPage,
            blogPage,
        ]
    }
}