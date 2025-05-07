/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { DialogElements } from "../pages/DialogElements";
import { SearchForm } from "../pages/SearchForm";
import { ResultTable } from "../pages/ResultTable";
import { UIViewSection } from "../pages/UIViewSection";

// Environment
const { portal } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const searchForm = new SearchForm();
const resultTable = new ResultTable();
const dialog = new DialogElements();
const uiView = new UIViewSection();

let randomNumber = `${Math.floor(Math.random() * 1000000)}` 
let variables = {
    "Name": `Smart User ${randomNumber}`,
    "Email": `notanemail${randomNumber}@mail.no`,
    "Mobile": "+01 999 876 123",
    "Phone": "+01 999 876 123" 
}
let responsible = "Cypress User";
let legalPerson = "Cypress Group";

let searchCriteria = {
    "Name": `Smart User ${randomNumber}`,
    "Email": `notanemail${randomNumber}@mail.no`,
    "Legal Person": legalPerson,
    "Responsible": responsible
}

describe("PA-15511 - CView - Responsible", () => {
    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("CView");
        mainNav.goTo("Responsibles");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it(`CView - Responsible - Create a Contact`, () => {
        cy.clickButton("Create");
        dialog.inputValue("Name", legalPerson);
        dialog.clickButton("Search");
        dialog.clickButton("Select");
        cy.waitForPageLoaded();
        uiView.waitForUIViewReady();
        Object.keys(variables).forEach((key) => {
            cy.inputValue(key, variables[key]);
        });
        cy.selectValue("Responsible", responsible);
        cy.selectValueRandomly("Division");
        cy.selectValueRandomly("Section");
        cy.selectValueRandomly("Class");
        cy.clickButton("Save");
        cy.verifySuccessMessagePopUp("Responsible has been created successfully.");
    });

    Object.keys(searchCriteria).forEach((key) => {
        it(`CView - Responsible - Search for ${key} and Validate`, () => {
            if (key.includes("Legal Person") ||
                key.includes("Responsible") ) {
                searchForm.selectValue(key, searchCriteria[key]);
            } else {
                searchForm.inputValue(key, searchCriteria[key]);
            }
            searchForm.verifySearchCriteria(key, searchCriteria[key]);
            searchForm.clickSearchButton();
            resultTable.verifyAllRowsBasedOnColumHeader(key, searchCriteria[key]);
        });
    });

    it(`CView - Responsible - Update a Contact`, () => {
        searchForm.inputValue("Name", variables['Name']);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Name", variables['Name']);
        resultTable.viewSpecificRowInResultTable(variables['Name']);
        cy.waitForPageLoaded();
        cy.clickButton("Edit");
        cy.inputValue("Name", variables['Name'] + " Updated");
        cy.clickButton("Save");
        cy.verifyPopUp("Responsible has been updated successfully.");
    });

    it(`CView - Responsible - Delete a Contact`, () => {
        searchForm.inputValue("Name", variables['Name'] + " Updated");
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Name", variables['Name'] + " Updated");
        resultTable.deleteSpecificRowInResultTable(variables['Name'] + " Updated");
        cy.verifyPopUp("Responsible has been deleted successfully.");
    });

});