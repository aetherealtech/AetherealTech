import { URL } from "url";
import * as TypeMoq from "typemoq"

type FakeDocument = {
    document: Document
    currentLocation: URL
}

function fakeDocument(): FakeDocument {
    const mockDocument = TypeMoq.Mock.ofType<Document>()

    const fakeDocument: FakeDocument = {
        document: mockDocument.object,
        currentLocation: new URL("https://test.com")
    }

    mockDocument.setup(d => d.location)
        .returns(() => {
            return {
                ...fakeDocument.currentLocation,
                ancestorOrigins: null,
                assign(_: string | URL) { },
                reload() { },
                replace(_: string | URL) { }
            }
        })

    return fakeDocument
}

type FakeHistory = {
    history: History
    setHistory(history: string[]): void
    popStateHandler: (ev: PopStateEvent) => void
}

function fakeHistory(document: FakeDocument): FakeHistory {
    const mockHistory = TypeMoq.Mock.ofType<History>()

    const history: URL[] = []
    let currentHistoryIndex = 0

    const fakeHistory: FakeHistory = {
        history: mockHistory.object,
        setHistory(paths: string[]) {
            const newHistory = paths
                .map(path => {
                    const url = new URL(document.currentLocation)
                    url.pathname = path
                    return url
                })

            history.splice(0, Infinity, ...newHistory)
            currentHistoryIndex = history.length
        },
        popStateHandler: (_: PopStateEvent) => {}
    }

    mockHistory.setup(h => h.length)
        .returns(() => history.length)

    mockHistory.setup(h => h.back())
        .callback(() => {
            mockHistory.object.go(-1)
        })

    mockHistory.setup(h => h.forward())
        .callback(() => {
            mockHistory.object.go(1)
        })

    function updateLocation(newUrl: URL): void {
        document.currentLocation = newUrl

        const event = TypeMoq.Mock.ofType<PopStateEvent>()
        fakeHistory.popStateHandler(event.object)
    }

    mockHistory.setup(h => h.go(TypeMoq.It.isAny()))
        .callback((delta: number | undefined) => {
            const newIndex = currentHistoryIndex + (delta ?? 0)

            if(newIndex < 0 || newIndex >= history.length)
                return

            currentHistoryIndex = newIndex

            updateLocation(history[currentHistoryIndex])
        })

    mockHistory.setup(h => h.pushState(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()))
        .callback((data: unknown, unused: string, url: URL | string | null | undefined) => {
            history.splice(currentHistoryIndex, Infinity, document.currentLocation)
            currentHistoryIndex += 1
            mockHistory.object.replaceState(data, unused, url)
        })

    mockHistory.setup(h => h.replaceState(TypeMoq.It.isAny(), TypeMoq.It.isAny(), TypeMoq.It.isAny()))
        .callback((data: unknown, unused: string, url: URL | string | null | undefined) => {
            let newUrl: URL

            if(typeof url === 'string') {
                newUrl = document.currentLocation
                newUrl.pathname = url
            } else if(url === null || url === undefined) {
                newUrl = this.document.currentLocation
            } else {
                newUrl = url
            }

            updateLocation(newUrl)
        })

    return fakeHistory
}

type FakeWindow = {
    window: Window & typeof globalThis
    setHistory(history: string[]): void
}

function fakeWindow(document: FakeDocument): FakeWindow {
    const mockWindow = TypeMoq.Mock.ofType<Window & typeof globalThis>()
    const history = fakeHistory(document)

    const fakeWindow: FakeWindow = {
        window: mockWindow.object,
        setHistory(newHistory: string[]) {
            history.setHistory(newHistory)
        }
    }

    mockWindow.setup(w => w.history)
        .returns(() => history.history)

    mockWindow.setup(w => w.onpopstate = TypeMoq.It.isAny())
        .callback((handler: ((this: WindowEventHandlers, ev: PopStateEvent) => unknown) | null) => {
            return history.popStateHandler = ev => {
                if(handler == null)
                    return

                handler.call(fakeWindow.window, ev)
            };
        })

    mockWindow.setup(w => w.addEventListener("popstate", TypeMoq.It.isAny()))
        .callback((_1: keyof WindowEventMap, handler: (this: Window, ev: PopStateEvent) => unknown, _2?: boolean | AddEventListenerOptions) => {
            const currentPopStateHandler = history.popStateHandler

            history.popStateHandler = ev => {
                currentPopStateHandler(ev)
                handler.call(fakeWindow.window, ev)
            }
        })

    return fakeWindow
}

export class FakeBrowser {
    get window(): Window & typeof globalThis { return this._fakeWindow.window }
    get document(): Document { return this._fakeDocument.document }

    setHistory(history: string[]) { this._fakeWindow.setHistory(history) }

    constructor() {
        this._fakeDocument = fakeDocument()
        this._fakeWindow = fakeWindow(this._fakeDocument)

        globalThis.window = this.window
        globalThis.document = this.document
    }

    private readonly _fakeWindow: FakeWindow
    private readonly _fakeDocument: FakeDocument
}