import {defineParameterType} from "@cucumber/cucumber";
import {Fixtures} from "./Fixtures.js";
import {type HomeViewModelProd} from "../../src/HomeViewModel.js";

defineParameterType({
    name: 'HomePage',
    regexp: /Home Page \[([^\[\]]*)]/,
    transformer: key => Fixtures.shared.getFixture<HomeViewModelProd>(key)
})