/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { ResultTable } from "../pages/ResultTable";
import { SearchForm } from "../pages/SearchForm";
import { RightInformationPanel } from "../pages/RightInformationPanel";

// Environment
const { portal, api, envValue } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const resultTable = new ResultTable();
const searchForm = new SearchForm();
const rightPanel = new RightInformationPanel();

let searchCriteria = {
    "Year": "",
    "Name": "",
    "Number": "",
    "Original Insured": "",
    "Source": ""
}

describe("Broker - Agreements Search", () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            cy.getAgreementDetails(envValue, token);
            cy.fixture(`${envValue}-agreementDetails`).then((data) => {
                const { year, name, number, originalInsured, source } = data.result[0];
                searchCriteria["Year"] = year.toString();
                searchCriteria["Number"] = number.toString();
                searchCriteria["Name"] = name;
                searchCriteria["Original Insured"] = originalInsured["name"];
                searchCriteria["Source"] = source["name"];
                console.log(searchCriteria);
            });
        });
    });

    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Broker");
        mainNav.goTo("Agreements");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    Object.keys(searchCriteria).forEach(key => {
        it(`Broker - Agreements Search - Search for ${key} and Validate`, () => {
            (key !== "Original Insured" && key !== "Source")
                ? searchForm.inputValue(key, searchCriteria[key])
                : searchForm.selectValue(key, searchCriteria[key])
            searchForm.verifySearchCriteria(key, searchCriteria[key]);
            searchForm.clickSearchButton();
            resultTable.verifyAllRowsBasedOnColumHeader(key, searchCriteria[key]);
        });
    });

    it("PA-15904 - Broker - Agreements - Overview and View", () => {
        searchForm.inputValue("Number", searchCriteria["Number"]);
        searchForm.verifySearchCriteria("Number", searchCriteria["Number"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Number", searchCriteria["Number"]);
        resultTable.verifyHeaderExisted("ID");
        resultTable.verifyHeaderExisted("Number");
        resultTable.verifyHeaderExisted("Year");
        resultTable.verifyHeaderExisted("Name");
        resultTable.verifyHeaderExisted("Original Insured");
        resultTable.clickFirstRowInResultTable();
        cy.verifyInputtedValue("Year", searchCriteria["Year"]);
        cy.verifySelectedValue("Original Insured", searchCriteria["Original Insured"]);
        cy.verifySelectedValue("Source", searchCriteria['Source']);
        cy.verifyInputtedValue("Name", searchCriteria["Name"]);
        rightPanel.verifyInformation("Year", searchCriteria["Year"]);
        rightPanel.verifyInformation("Number", searchCriteria["Number"]);
        rightPanel.verifyInformation("Original Insured", searchCriteria["Original Insured"]);
        rightPanel.verifyInformation("Source", searchCriteria["Source"]);
        cy.clickButton("Back to Search Agreements");
    });

});