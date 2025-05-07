/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { ResultTable } from "../pages/ResultTable";
import { SearchForm } from "../pages/SearchForm";
import { substringToLastIndex } from "../support/utils";

// Environment
const { portal , api , envValue } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const resultTable = new ResultTable();
const searchForm = new SearchForm();

let year = String(new Date().getFullYear());

let offerDetail = {
    "Original Insured" : "",
    "Team" : "",
    "Created By" : "Web Administrator",
    "Status" : ""
}

describe("Broker - Offer Search", () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            cy.getOfferAgreementDetails(envValue, token);
            cy.fixture(`${envValue}-offerAgreementDetails`).then((data) => {
                const { agreement, status } = data.result[0];
                offerDetail["Original Insured"] = agreement.originalInsured["name"];
                offerDetail["Team"] = agreement.team;
                offerDetail["Status"] = substringToLastIndex(status, 0, "_");
                console.log(offerDetail);
            });
        });
    });

    beforeEach(() => {		
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Broker");
        mainNav.goTo("Offers");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it("Broker - Offer Search - Search for Original Insured and Validate", () => {
        searchForm.inputValue("Year", year);
        searchForm.selectValue("Original Insured", offerDetail["Original Insured"]);
        searchForm.verifySearchCriteria("Original Insured", offerDetail["Original Insured"]);
        searchForm.clickResetButton()
        searchForm.selectValue("Original Insured", offerDetail["Original Insured"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Original Insured", offerDetail["Original Insured"]);
    });

    it("Broker - Offer Search - Search for Team and Validate", () => {
        searchForm.inputValue("Year", year);
        searchForm.selectValueByDataValue("Team", offerDetail["Team"]);
        searchForm.clickResetButton();
        searchForm.selectValueByDataValue("Team", offerDetail["Team"]);
        searchForm.clickSearchButton();
        resultTable.verifyResultsReturned();
    });

    it("Broker - Offer Search - Search for Created By and Validate", () => {
        searchForm.inputValue("Year", year);
        searchForm.selectValue("Created By", offerDetail["Created By"]);
        searchForm.verifySearchCriteria("Created By", offerDetail["Created By"]);
        searchForm.clickResetButton()
        searchForm.selectValue("Created By", offerDetail["Created By"]);
        searchForm.clickSearchButton();
        resultTable.verifyResultsReturned();        
    });

    it("Broker - Offer Search - Search for Status and Validate", () => {
        searchForm.inputValue("Year", year);
        searchForm.selectValue("Status", offerDetail["Status"]);
        searchForm.verifySearchCriteria("Status", offerDetail["Status"]);
        searchForm.clickResetButton()
        searchForm.selectValue("Status", offerDetail["Status"]);
        searchForm.clickSearchButton();        
        resultTable.verifyAllRowsBasedOnColumHeader("Offer Status", offerDetail["Status"]);        
    });
});