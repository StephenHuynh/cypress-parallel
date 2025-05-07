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

let managerVars = {
    "Id": "5339",
    "Name": "Cypress Group",
    "Short Name": "Cypress Group",
    "SSN": "08090000000",
    "Org.no": "971274255"
}

let fleets = {
    "Name": "Cypress Fleets",
    "Client Advocate": "Web Administrator",
    "Status": "Active"
}

describe(`PA-15802 - Broker - Objects Advanced Search`, () => {                	
    beforeEach(() => {		                                    
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Broker");
        mainNav.goTo("Objects");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    Object.keys(managerVars).forEach(key => {
        it(`Broker - Objects Advanced Search - Managers - Search for ${key}`, () => {
            searchForm.clickMagnifierIcon("Manager");
            dialog.clickButton("Reset");
            dialog.inputValue(key, managerVars[key]);
            dialog.verifySearchCriteria(key, managerVars[key]);
            dialog.clickButton("Search");
            dialog.verifyAllRowsBasedOnColumHeader(key, managerVars[key]);
        });
    });

    Object.keys(managerVars).forEach(key => {
        it(`Broker - Objects Advanced Search - Owners - Search for ${key}`, () => {
            searchForm.clickMagnifierIcon("Owner");
            dialog.clickButton("Reset");
            dialog.inputValue(key, managerVars[key]);
            dialog.verifySearchCriteria(key, managerVars[key]);
            dialog.clickButton("Search");
            dialog.verifyAllRowsBasedOnColumHeader(key, managerVars[key]);
        });
    });

    it(`Broker - Objects Advanced Search - Fleets - Search for Name`, () => {
        searchForm.clickMagnifierIcon("Fleet");
        dialog.clickButton("Reset");
        dialog.inputValue("Name", fleets['Name']);
        dialog.verifySearchCriteria("Name", fleets['Name']);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Name", fleets['Name']);
    });

    it(`Broker - Objects Advanced Search - Fleets - Search for Client Advocate`, () => {
        searchForm.clickMagnifierIcon("Fleet");
        dialog.clickButton("Reset");
        dialog.selectValue("Client Advocate", fleets['Client Advocate']);
        dialog.verifySearchCriteria("Client Advocate", fleets['Client Advocate']);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Client Advocate", fleets['Client Advocate']);
    });

    it(`Broker - Objects Advanced Search - Fleets - Search for Status`, () => {
        searchForm.clickMagnifierIcon("Fleet");
        dialog.clickButton("Reset");
        dialog.selectValue("Status", fleets['Status']);
        dialog.verifySearchCriteria("Status", fleets['Status']);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Status", fleets['Status']);
    });   

});