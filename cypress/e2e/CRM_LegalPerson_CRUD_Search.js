/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { SearchForm } from "../pages/SearchForm";
import { ResultTable } from "../pages/ResultTable";

// Environment
const { portal, envValue, api } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const searchForm = new SearchForm();
const resultTable = new ResultTable();

let personDetail = {
    "Name": "",
    "Short Name": "",
    "SSN": "",
    "Type": "Customer (dir)",
    "Id": "",
    "Country": "",
    "Email": "",
}

describe("CView - Legal Persons - Search", () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            cy.getLegalPersonDetails(envValue, token);
            cy.fixture(`${envValue}-legalPersonDetails`).then((data) => {
                personDetail["Name"] = data.result[0].name;
                personDetail["Short Name"] = data.result[0].shortName;
                personDetail["SSN"] = data.result[0].ssn;
                personDetail["Id"] = (data.result[0].id).toString();
                personDetail["Email"] = data.result[0].email;
                cy.getGeographicCode(token, "COUNTRY_CODE", data.result[0].version.countryCode)
                    .then((res) => {
                        personDetail["Country"] = res.result[0].description;
                    });
            });
        });
    });

    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("CView");
        mainNav.goTo("Legal Persons");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it("PA-15498 - CView - Legal Persons - Search for Id and Validate", () => {
        searchForm.inputValue("Id", personDetail["Id"]);
        searchForm.verifySearchCriteria("Id", personDetail["Id"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Id", personDetail["Id"]);
    });

    it("PA-15498 - CView - Legal Persons - Search for Name and Validate", () => {
        searchForm.inputValue("Name", personDetail["Name"]);
        searchForm.verifySearchCriteria("Name", personDetail["Name"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Name", personDetail["Name"]);
    });

    it("PA-15498 - CView - Legal Persons - Search for Short Name and Validate", () => {
        searchForm.inputValue("Short Name", personDetail["Short Name"]);
        searchForm.verifySearchCriteria("Short Name", personDetail["Short Name"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Short Name", personDetail["Short Name"]);
    });

    it("PA-15498 - CView - Legal Persons - Search for SSN and Validate", () => {
        searchForm.inputValue("SSN", personDetail["SSN"]);
        searchForm.verifySearchCriteria("SSN", personDetail["SSN"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("SSN", personDetail["SSN"]);
    });

    it("PA-15498 - CView - Legal Persons - Search for Type and Validate", () => {
        searchForm.selectValue("Type", personDetail["Type"]);
        searchForm.verifySearchCriteria("Type", personDetail["Type"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Type", personDetail["Type"]);
    });

    it("PA-15498 - CView - Legal Persons - Search for Email and Validate", () => {
        searchForm.inputValue("Email", personDetail["Email"]);
        searchForm.verifySearchCriteria("Email", personDetail["Email"]);
        mainNav.sideMenu();
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Email", personDetail["Email"]);
    });

    it("PA-15498 - CView - Legal Persons - Search for Country and Validate", () => {
        searchForm.inputValue("Name", personDetail["Name"]);
        searchForm.selectValue("Country", personDetail["Country"]);
        searchForm.verifySearchCriteria("Country", personDetail["Country"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Country", personDetail["Country"]);
    });

});