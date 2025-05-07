/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { ResultTable } from "../pages/ResultTable";
import { SearchForm } from "../pages/SearchForm";
import { substringToLastIndex } from "../support/utils";

// Environment
const { portal, envValue, api } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const searchForm = new SearchForm();
const resultTable = new ResultTable();

let searchCriteria = {
    "Name": "",
    "Client Advocate" : "",
    "Connected Object" : "Anna Knutsen",
    "Manager" : "Noria AS",
    "Status" : ""
}

describe("Broker - Fleets Search", () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            cy.getFleetDetails(token).then((data) => {
                let index = 0;
                const { name, clientAdvocate, status } = data.result[index];
                searchCriteria["Name"] = name;
                searchCriteria["Client Advocate"] = clientAdvocate;
                searchCriteria["Status"] = substringToLastIndex(status, 0, "_");
                cy.getSignatureDetails(envValue, token, clientAdvocate);
                console.log(searchCriteria);           
            }).then(() => {
                let file = `${envValue}-${searchCriteria["Client Advocate"]}Details`;
                cy.fixture(file).then(details => {
                    searchCriteria["Client Advocate"] = details.name;
                });
            });        
        });
    });

    beforeEach(() => {		
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Broker");
        mainNav.goTo("Fleets");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it("Broker - Fleets Search - Search for Name", () => {
        searchForm.inputValue("Name", searchCriteria["Name"]);
        searchForm.verifySearchCriteria("Name", searchCriteria["Name"]);
        searchForm.clickResetButton();
        searchForm.inputValue("Name", searchCriteria["Name"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Name", searchCriteria["Name"]);
    });

    it("PA-15827 - Broker - Fleets Search - Search for Client Advocate", () => {
        searchForm.selectValue("Client Advocate", searchCriteria["Client Advocate"]);
        searchForm.verifySearchCriteria("Client Advocate", searchCriteria["Client Advocate"]);
        searchForm.clickResetButton();
        searchForm.selectValue("Client Advocate", searchCriteria["Client Advocate"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Client Advocate", searchCriteria["Client Advocate"]);
    });

    it("PA-15827 - Broker - Fleets Search - Search for Connected Object", () => {
        searchForm.selectValue("Connected Object", searchCriteria["Connected Object"]);
        searchForm.verifySearchCriteria("Connected Object", searchCriteria["Connected Object"]);
        searchForm.clickResetButton();
        searchForm.selectValue("Connected Object", searchCriteria["Connected Object"]);
        searchForm.clickSearchButton();
        resultTable.verifyResultsReturned();          
    });

    it("PA-15827 - Broker - Fleets Search - Search for Manager", () => {
        searchForm.selectValue("Manager", searchCriteria["Manager"]);
        searchForm.verifySearchCriteria("Manager", searchCriteria["Manager"]);
        searchForm.clickResetButton();
        searchForm.selectValue("Manager", searchCriteria["Manager"]);
        searchForm.clickSearchButton();        
        resultTable.verifyResultsReturned();          
    });

    it("PA-15827 - Broker - Fleets Search - Search for Status", () => {
        searchForm.selectValue("Status", searchCriteria["Status"]);
        searchForm.verifySearchCriteria("Status", searchCriteria["Status"]);
        searchForm.clickResetButton();
        searchForm.selectValue("Status", searchCriteria["Status"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Status", searchCriteria["Status"]);                  
    });
});