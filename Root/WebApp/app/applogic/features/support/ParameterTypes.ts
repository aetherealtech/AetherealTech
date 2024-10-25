import {defineParameterType} from "@cucumber/cucumber";
import {Fixtures} from "./Fixtures.js";
import {type RootViewModelProd} from "../../src/root/RootViewModel.js";

defineParameterType({
    name: 'App',
    regexp: /App \[([^\[\]]*)]/,
    transformer: key => Fixtures.shared.getFixture<RootViewModelProd>(key)
})