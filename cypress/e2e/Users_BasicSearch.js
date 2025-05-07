/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { ResultTable } from "../pages/ResultTable";
import { SearchForm } from "../pages/SearchForm";

// Environment
const { portal, envValue, api } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const resultTable = new ResultTable();
const searchForm = new SearchForm();

let searchCriteria = {
    "Name": "",
    "Email": "",
    "SSN": ""
}

let statusCriteria = {
    "Active": "Yes",
    "2FA Enabled": "Yes"
}

describe("User Search", () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            cy.getUserDetails(envValue, token); 
            cy.fixture(`${envValue}-userDetails`).then((data) => {
                searchCriteria["Name"] = data.result[0].name;
                searchCriteria["Email"] = data.result[0].email;                
                console.log(searchCriteria);
            });
            cy.getUserDetailsBySSN(envValue, token);
            cy.fixture(`${envValue}-userDetailsBySSN`).then((data) => {
                searchCriteria["SSN"] = data.result[0]?.ssn;
                console.log(searchCriteria);
            });            
        });
    });

    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Self Service");
        mainNav.goTo("Users");
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it("User Search - Search Name, Email and Validate", () => {
        searchForm.clickResetButton();
        searchForm.inputValue("Name", searchCriteria["Name"]);
        searchForm.verifySearchCriteria("Name", searchCriteria["Name"]);
        searchForm.inputValue("Email", searchCriteria["Email"]);
        searchForm.verifySearchCriteria("Email", searchCriteria["Email"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Name", searchCriteria["Name"]); 
        resultTable.verifyAllRowsBasedOnColumHeader("Email", searchCriteria["Email"]);         
    });

    it("User Search - Search SSN and Validate", () => {
        searchForm.clickResetButton();
        searchForm.inputValue("SSN", searchCriteria["SSN"]);
        searchForm.verifySearchCriteria("SSN", searchCriteria["SSN"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("SSN", searchCriteria["SSN"]); 
    });

    it("User Search - Search Status and Validate", () => {
        searchForm.clickResetButton();
        Object.keys(statusCriteria).forEach((key) => {
            searchForm.selectValue(key, statusCriteria[key]);
            searchForm.verifySearchCriteria(key, statusCriteria[key]);
        });
        searchForm.clickSearchButton();
        Object.keys(statusCriteria).forEach((key) => {
            resultTable.verifyNonTextColumnInResultTable(key, statusCriteria[key]); 
        });
    });

});