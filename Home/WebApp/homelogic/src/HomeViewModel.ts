// import {type Observable, fromEvent, map, tap, combineLatest, mergeWith, of} from "rxjs"
import { type Observable, BehaviorSubject, of, mergeWith, fromEvent, combineLatest } from "rxjs"

export type Link = {
    title: string,
    destination: string
}

export type CTA = {
    title: string
    perform(): void
}

export type Line = {
    start: number,
    size: number
}

export interface Card {
    title: string
    contents: Link[]
    cta: CTA
    alpha: Observable<number>

    set yFrame(value: Line)
}

export type HomeViewModel = {
    cards: Card[]
}

class CardProd implements Card {
    title: string
    contents: Link[]
    cta: CTA
    alpha: Observable<number>

    set yFrame(value: Line) {
        this._yFrame.next(value)
    }

    constructor(
        title: string,
        contents: Link[],
        cta: CTA,
        height: Observable<number>,
        scrollY: Observable<number>
    ) {
        this.title = title
        this.contents = contents
        this.cta = cta

        this.alpha = combineLatest(
            this._yFrame, height, scrollY,
            (yFrameAbsolute, height, scrollY) => {
                if(yFrameAbsolute === undefined)
                    return 1.0

                const yTop = yFrameAbsolute.start - scrollY
                const yBottom = yTop + yFrameAbsolute.size

                const yTopRelative = yTop / height
                const yBottomRelative = yBottom / height

                const limit = 0.35

                if(yBottomRelative < limit)
                    return yBottomRelative / limit

                if(yTopRelative > (1 - limit))
                    return (1.0 - yTopRelative) / limit

                return 1.0
            }
        )
    }

    private readonly _yFrame = new BehaviorSubject<Line | undefined>(undefined)
}

export class HomeViewModelProd implements HomeViewModel {
    readonly cards: Card[]

    constructor() {
        // const aspectRatio = 1
        //
        const height = of(window.innerHeight).pipe(
            mergeWith(
                fromEvent(
                    window,
                    'resize',
                    _ => window.innerHeight
                )
            )
        )

        const scrollY = of(window.scrollY).pipe(
            mergeWith(
                fromEvent(
                    document,
                    'scroll',
                    _ => window.scrollY
                )
            )
        )

        // const contentHeight = 1500
        //
        // const scrollPosition = fromEvent(
        //     document,
        //     'scroll',
        //     _ => window.scrollY
        // )

        this.cards = [
            new CardProd(
                "Services in Software Contracting,\nConsulting and Coaching",
                [],
                {
                    title: "Learn More",
                    perform() { console.log("OPEN ABOUT") }
                },
                height,
                scrollY
            ),
            new CardProd(
                "Case Studies",
                [
                    {
                        title: "This Case Study",
                        destination: "/casestudies/thiscasestudy"
                    },
                    {
                        title: "That Case Study",
                        destination: "/casestudies/thatcasestudy"
                    },
                ],
                {
                    title: "View All",
                    perform() { console.log("OPEN CASE STUDIES") }
                },
                height,
                scrollY
            ),
            new CardProd(
                "Portfolio",
                [
                    {
                        title: "GitHub",
                        destination: "https://github.com/aetherealtech"
                    }
                ],
                {
                    title: "View All",
                    perform() { console.log("OPEN PORTFOLIO") }
                },
                height,
                scrollY
            ),
            new CardProd(
                "Latest Articles",
                [
                    {
                        title: "This Article",
                        destination: "/articles/thisarticle"
                    }
                ],
                {
                    title: "View All",
                    perform() { console.log("OPEN ARTICLES") }
                },
                height,
                scrollY
            ),
            new CardProd(
                "Swift Labs",
                [
                    {
                        title: "This Project",
                        destination: "/swiftlabs/thisproject"
                    }
                ],
                {
                    title: "View All",
                    perform() { console.log("OPEN SWIFT LABS") }
                },
                height,
                scrollY
            )
        ]
    }
}