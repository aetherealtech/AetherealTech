import {defineParameterType} from "@cucumber/cucumber";
import {Fixtures} from "./Fixtures.js";
import {type BlogViewModelProd} from "../../src/BlogViewModel";

defineParameterType({
    name: 'BlogPage',
    regexp: /Blog Page \[([^\[\]]*)]/,
    transformer: key => Fixtures.shared.getFixture<BlogViewModelProd>(key)
})