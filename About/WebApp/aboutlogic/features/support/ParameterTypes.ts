import {defineParameterType} from "@cucumber/cucumber";
import {Fixtures} from "./Fixtures.js";
import {type AboutViewModelProd} from "../../src/AboutViewModel.js";

defineParameterType({
    name: 'AboutPage',
    regexp: /About Page \[([^\[\]]*)]/,
    transformer: key => Fixtures.shared.getFixture<AboutViewModelProd>(key)
})