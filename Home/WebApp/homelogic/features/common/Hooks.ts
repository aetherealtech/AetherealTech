import {binding} from "cucumber-tsflow/dist/binding-decorator.js"
import {after} from "cucumber-tsflow/dist/hook-decorators.js"

import {Fixtures} from "../support/Fixtures.js";

@binding()
export class Hooks {
    @after()
    resetFixtures(): void {
        Fixtures.shared.reset()
    }
}