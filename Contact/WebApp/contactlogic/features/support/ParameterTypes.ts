import {defineParameterType} from "@cucumber/cucumber";
import {Fixtures} from "./Fixtures.js";
import {type ContactViewModelProd} from "../../src/ContactViewModel";

defineParameterType({
    name: 'ContactPage',
    regexp: /Contact Page \[([^\[\]]*)]/,
    transformer: key => Fixtures.shared.getFixture<ContactViewModelProd>(key)
})