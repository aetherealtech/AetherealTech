import {type Page, type PageContent, type RootViewModel} from 'app'
import {Subject, BehaviorSubject, type Observable} from "rxjs";

declare global {
    interface Window {
        rootViewModel: RootViewModelStub
    }
}

export class RootViewModelStub implements RootViewModel {
    content: BehaviorSubject<PageContent | null> = new BehaviorSubject<PageContent | null>(null)
    pages: Page[]

    get selectEvents(): Observable<string> { return this._selectEvents }

    constructor(
        pages: string[]
    ) {
        this.pages = pages
            .map(page=> {
                return {
                    label: page,
                    select: ()=> { this._selectEvents.next(page) }
                }
            })
    }

    private readonly _selectEvents = new Subject<string>()
}