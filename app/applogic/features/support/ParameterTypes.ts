import {defineParameterType} from "@cucumber/cucumber";
import {Fixtures} from "./Fixtures";
import {type RootViewModelProd} from "../../src";

defineParameterType({
    name: 'App',
    regexp: /App \[(.*)]/,
    transformer: key => Fixtures.shared.getFixture<RootViewModelProd>(key)
})