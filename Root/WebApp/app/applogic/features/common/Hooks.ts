import {binding} from "cucumber-tsflow/dist/binding-decorator.js"
import {beforeAll, after} from "cucumber-tsflow/dist/hook-decorators.js"

import {FakeBrowser} from "../support/FakeBrowser.js"
import {Fixtures} from "../support/Fixtures.js";

@binding()
export class Hooks {
    @beforeAll()
    prepareBrowser(): void {
        const browser = FakeBrowser.instance

        globalThis.window = browser.window
        globalThis.document = browser.document
    }

    @after()
    resetFixtures(): void {
        Fixtures.shared.reset()
    }
}