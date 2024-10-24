import { Subject, BehaviorSubject } from "rxjs";
export class RootViewModelStub {
    get selectEvents() { return this._selectEvents; }
    constructor(pages) {
        this.content = new BehaviorSubject(null);
        this._selectEvents = new Subject();
        this.pages = pages
            .map(page => {
            return {
                label: page,
                select: () => { this._selectEvents.next(page); }
            };
        });
    }
}
