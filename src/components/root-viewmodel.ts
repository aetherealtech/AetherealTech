export type Page = {
    label: string
    path: string
}

export type RootViewModel = {
    pages: Page[]
}

export class RootViewModelProd implements RootViewModel {
    pages: Page[]

    constructor() {
        this.pages = [
            {
                label: "Home",
                path: "/"
            },
            {
                label: "About",
                path: "/about"
            },
            {
                label: "Contact",
                path: "/contact"
            },
            {
                label: "Blog",
                path: "/blog"
            },
        ];
    }
}

export {}