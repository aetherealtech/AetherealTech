import {defineParameterType} from "@cucumber/cucumber";
import {Fixtures} from "./Fixtures.js";
import {type PageRouteDescriptor, type RootViewModelProd} from "../../src/RootViewModel.js"
import {type FakeBrowser} from "./FakeBrowser.js"

defineParameterType({
    name: 'Text',
    regexp: /Text \[([^\[\]]*)]/,
    transformer: key => Fixtures.shared.getFixture<string>(key)
})

defineParameterType({
    name: 'TextValue',
    regexp: /("(.*)"|Text \[([^\[\]]*)])/,
    transformer: (string) => {
        const variableMatcher = new RegExp(/Text \[([^\[\]]*)]/)
        const variableMatch = variableMatcher.exec(string)
        if(variableMatch == null)
            return string.substring(1, string.length - 1)

        const key = variableMatch[1]
        return Fixtures.shared.getFixture<string>(key).value
    }
})

defineParameterType({
    name: 'Page',
    regexp: /Page \[([^\[\]]*)]/,
    transformer: key => Fixtures.shared.getFixture<PageRouteDescriptor>(key)
})

defineParameterType({
    name: 'ListOfPages',
    regexp: /List of Pages \[([^\[\]]*)]/,
    transformer: key => Fixtures.shared.getFixture<PageRouteDescriptor[]>(key)
})

defineParameterType({
    name: 'Browser',
    regexp: /Browser \[([^\[\]]*)]/,
    transformer: key => Fixtures.shared.getFixture<FakeBrowser>(key)
})

defineParameterType({
    name: 'App',
    regexp: /App \[([^\[\]]*)]/,
    transformer: key => Fixtures.shared.getFixture<RootViewModelProd>(key)
})