/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { DialogElements } from "../pages/DialogElements";
import { SearchForm } from "../pages/SearchForm";

// Environment
const { portal } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const dialog = new DialogElements();
const searchForm = new SearchForm();

let originalInsured = {
    "Id": "4568",
    "Name": "Ferncroft Investments Ltd",
    "SSN": "28128400100",
    "Org.no": "990280401",
}

describe("Broker - Offers Advanced Search", () => {                	
    beforeEach(() => {		                                    
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Broker");
        mainNav.goTo("Offers");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it(`Offer - Offers Advanced Search - Search for Id and Validate`, () => {
        searchForm.clickMagnifierIcon("Original Insured");
        dialog.inputValue("Id", originalInsured["Id"]);
        dialog.verifySearchCriteria("Id", originalInsured["Id"]);
        dialog.removeSearchCriteria("Id");
        dialog.inputValue("Id", originalInsured["Id"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Id", originalInsured["Id"]);
    });

    it(`Offer - Offers Advanced Search - Search for Name and Validate`, () => {
        searchForm.clickMagnifierIcon("Original Insured");
        dialog.inputValue("Name", originalInsured["Name"]);
        dialog.verifySearchCriteria("Name", originalInsured["Name"]);
        dialog.removeSearchCriteria("Name");
        dialog.inputValue("Name", originalInsured["Name"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Name", originalInsured["Name"]);
    });

    it(`Offer - Offers Advanced Search - Search for SSN and Validate`, () => {
        searchForm.clickMagnifierIcon("Original Insured");
        dialog.inputValue("SSN", originalInsured["SSN"]);
        dialog.verifySearchCriteria("SSN", originalInsured["SSN"]);
        dialog.removeSearchCriteria("SSN");
        dialog.inputValue("SSN", originalInsured["SSN"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("SSN", originalInsured["SSN"]);
    });

    it(`Offer - Offers Advanced Search - Search for Org.no and Validate`, () => {
        searchForm.clickMagnifierIcon("Original Insured");
        dialog.inputValue("Org.no", originalInsured["Org.no"]);
        dialog.verifySearchCriteria("Org.no", originalInsured["Org.no"]);
        dialog.removeSearchCriteria("Org.no");
        dialog.inputValue("Org.no", originalInsured["Org.no"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Org.no", originalInsured["Org.no"]);
    });

});