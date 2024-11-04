import { type HomeViewModel, HomeViewModelProd } from "homelogic";
import { type AboutViewModel, AboutViewModelProd } from "aboutlogic";
import { type ContactViewModel, ContactViewModelProd } from "contactlogic";
import { type BlogViewModel, BlogViewModelProd } from "bloglogic";
import { Subject, BehaviorSubject, Observable, fromEvent, map, mergeWith, of, EMPTY } from "rxjs";

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

export type Page = {
    label: string
    select(): void
}

export type RootViewModel = {
    pages: Page[]
    content: Observable<PageContent | null>
}

export type PageRouteDescriptor = {
    label: string;
    route: string
    contentFactory: () => PageContent
}

class PageRoute implements Page {
    constructor(
        descriptor: PageRouteDescriptor,
        content: Subject<() => PageContent>
    ) {
        this.label = descriptor.label
        this.route = descriptor.route
        this.contentFactory = descriptor.contentFactory

        this._content = content
    }

    label: string;
    route: string

    contentFactory: () => PageContent

    select(): void {
        this._content.next(this.contentFactory)
        window.history.pushState({}, "", this.route)
    }

    private readonly _content: Subject<() => PageContent>
}

export class RootViewModelProd implements RootViewModel {
    public get pages(): Page[] { return this._pageRoutes }
    public readonly content: Observable<PageContent | null>

    public constructor(
        path: string,
        pages: PageRouteDescriptor[] = RootViewModelProd.defaultPages()
    ) {
        const pageSelections = new Subject<() => PageContent>()

        this._pageRoutes = pages
            .map(page => new PageRoute(page, pageSelections))

        const pathUpdates = window !== undefined ? fromEvent(
            window,
            'popstate',
            _ => {
                return document.location.pathname
            }
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
                    const route = this._pageRoutes
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
        const homePage: PageRouteDescriptor = {
            label: "Home",
            route: "/",
            contentFactory: () => ({type: "home", content: new HomeViewModelProd()})
        }

        const aboutPage: PageRouteDescriptor = {
            label: "About",
            route: "/about",
            contentFactory: () => ({type: "about", content: new AboutViewModelProd()})
        }

        const contactPage: PageRouteDescriptor = {
            label: "Contact",
            route: "/contact",
            contentFactory: () => ({type: "contact", content: new ContactViewModelProd()})
        }

        const blogPage: PageRouteDescriptor = {
            label: "Blog",
            route: "/blog",
            contentFactory: () => ({type: "blog", content: new BlogViewModelProd()})
        }

        return [
            homePage,
            aboutPage,
            contactPage,
            blogPage,
        ]
    }

    private readonly _pageRoutes: PageRoute[]
}