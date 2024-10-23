import {type HomeViewModel, HomeViewModelProd} from "../home/HomeViewModel";
import {type AboutViewModel, AboutViewModelProd} from "../about/AboutViewModel";
import {type ContactViewModel, ContactViewModelProd} from "../contact/ContactViewModel";
import {type BlogViewModel, BlogViewModelProd} from "../blog/BlogViewModel";
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

class PageRoute implements Page {
    constructor(
        label: string,
        route: string,
        contentFactory: () => PageContent,
        content: BehaviorSubject<PageContent | null>
    ) {
        this.label = label
        this.route = route
        this.contentFactory = contentFactory

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
    pages: Page[]
    get content(): Observable<PageContent | null> { return this._content }

    constructor(
        path: string
    ) {
        const homePage = new PageRoute(
            "Home",
            "/",
            () => ({ type: "home", ...new HomeViewModelProd() }),
            this._content
        )

        const aboutPage = new PageRoute(
            "About",
            "/about",
            () => ({ type: "about", ...new AboutViewModelProd() }),
            this._content
        )

        const contactPage = new PageRoute(
            "Contact",
            "/contact",
            () => ({ type: "contact", ...new ContactViewModelProd() }),
            this._content
        )

        const blogPage = new PageRoute(
            "Blog",
            "/blog",
            () => ({ type: "blog", ...new BlogViewModelProd() }),
            this._content
        )

        const pages = [
            homePage,
            aboutPage,
            contactPage,
            blogPage,
        ]

        this.pages = pages;

        const currentPage: PageRoute | undefined = pages
            .find((page) => page.route == path)

        if(currentPage != undefined)
            this._content.next(currentPage.contentFactory())
    }

    private readonly _content = new BehaviorSubject<PageContent | null>(null)
}