import {after, binding} from "cucumber-tsflow";
import {Fixtures} from "../support/Fixtures";

@binding()
export class Hooks {
    @after()
    resetFixtures(): void {
        Fixtures.shared.reset()
    }
}

// export = Hooks