import {type HomeViewModel, HomeViewModelProd} from "homelogic";
import {type AboutViewModel, AboutViewModelProd} from "aboutlogic";
import {type ContactViewModel, ContactViewModelProd} from "contactlogic";
import {type BlogViewModel, BlogViewModelProd} from "bloglogic";
import {BehaviorSubject, type Observable} from "rxjs";

export type HomePageContent = HomeViewModel & {
    type: "home"
}

export type AboutPageContent = AboutViewModel & {
    type: "about"
}

export type ContactPageContent = ContactViewModel & {
    type: "contact"
}

export type BlogPageContent = BlogViewModel & {
    type: "blog"
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
        content: BehaviorSubject<PageContent | null>
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
        this._content.next(this.contentFactory())
        window.history.pushState({}, "", this.route)
    }

    private readonly _content: BehaviorSubject<PageContent | null>
}

export class RootViewModelProd implements RootViewModel {
    public get pages(): Page[] { return this._pageRoutes }
    public get content(): Observable<PageContent | null> { return this._content }

    public constructor(
        path: string,
        pages: PageRouteDescriptor[] = RootViewModelProd.defaultPages()
    ) {
        this._pageRoutes = pages
            .map(page => new PageRoute(page, this._content))

        this.navigate(path);

        if(window != undefined) {
            window.addEventListener("popstate", _ => {
                this.navigate(document.location.pathname)
            })
        }
    }

    public static defaultPages() {
        const homePage: PageRouteDescriptor = {
            label: "Home",
            route: "/",
            contentFactory: () => ({type: "home", ...new HomeViewModelProd()})
        }

        const aboutPage: PageRouteDescriptor = {
            label: "About",
            route: "/about",
            contentFactory: () => ({type: "about", ...new AboutViewModelProd()})
        }

        const contactPage: PageRouteDescriptor = {
            label: "Contact",
            route: "/contact",
            contentFactory: () => ({type: "contact", ...new ContactViewModelProd()})
        }

        const blogPage: PageRouteDescriptor = {
            label: "Blog",
            route: "/blog",
            contentFactory: () => ({type: "blog", ...new BlogViewModelProd()})
        }

        return [
            homePage,
            aboutPage,
            contactPage,
            blogPage,
        ]
    }

    private readonly _content = new BehaviorSubject<PageContent | null>(null)
    private readonly _pageRoutes: PageRoute[]

    private navigate(path: string) {
        const currentPage: PageRoute | undefined = this._pageRoutes
            .find((page) => page.route == path)

        if (currentPage != undefined)
            this._content.next(currentPage.contentFactory())
    }
}