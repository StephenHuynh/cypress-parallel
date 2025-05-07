/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { ResultTable } from "../pages/ResultTable";
import { ConfigurationsPage } from "../pages/ConfigurationsPage";
import { getCurrentDateFormatted } from "../support/utils";

// Environment
const { portal } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const resultTable = new ResultTable();
const configPage = new ConfigurationsPage();
const currentDate = getCurrentDateFormatted("DD-MM-YYYY");

let { tableSection } = resultTable.resultTableSection;
let search_variables = {
    "Type": "Person Document",
    "Description": `Notification Type ${currentDate}`
}

let language_variables = {
    "English": {
        "Short Description": "Thanks",
        "Medium Description": "Hello",
        "Description": "I don't speak English",
    },
    "French": {
        "Short Description": "Merci",
        "Medium Description": "Bonjour",
        "Description": "Je ne parle pas francais",
    },
}

describe("User Notification Types", () => {
    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Self Service");
        mainNav.goTo("Configurations");
        cy.clickTab("User Notification Types");
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it("User Notification Types - Create a Group", () => {
        cy.clickTab("Document Notification Groups");
        // Checking if Certificate is available in table
        configPage.deleteNotificationGroup(search_variables["Type"]);
        cy.clickButton("Add Group");
        cy.inputValue("Description", search_variables["Description"]);
        configPage.selectDocumentType(search_variables["Type"]);
        configPage.addDocumentType();
        cy.saveAndVerifySuccessfulMessage("The document notification group has been created successfully.");
    });

    it("PA-15707 - User Notification Types - Sort", () => {
        cy.resultTableIsSortedBy("Description"); //ascending
        cy.resultTableIsSortedBy("Description"); //descending
        cy.resultTableIsSortedBy("ID", "Numeric"); //ascending
        cy.resultTableIsSortedBy("ID", "Numeric"); //descending
        cy.resultTableIsSortedBy("Type"); //ascending
        cy.resultTableIsSortedBy("Type"); //descending
    });

    it("PA-15709 - User Notification Types - Edit Description Field", () => {
        // Type in the search box
        cy.inputValueByPlaceHolder("Search", search_variables["Description"]);
        resultTable.clickFirstRowInResultTable();
        // Start editing
        cy.clickButton("Edit");
        // Edit and Reset
        cy.inputValue("Description", search_variables["Description"] + " - Edited");
        Object.keys(language_variables).forEach(function (key) {
            cy.get(tableSection["selector"]).first().within(() => {
                Object.keys(language_variables[key]).forEach(function (description) {
                    cy.get("th").each(($element) => {
                        if ($element.text() == description) {
                            cy.wrap($element).invoke('index').then((index) => {
                                cy.get("tbody").contains("tr", key).within(() => {
                                    cy.get("td").eq(index).type(language_variables[key][description]);
                                });
                            });
                        }
                    });
                });
            });
        });
        cy.clickButton("Reset");
        cy.verifyInputtedValue("Description", search_variables["Description"]);
        Object.keys(language_variables).forEach(function (key) {
            cy.get(tableSection["selector"]).first().within(() => {
                Object.keys(language_variables[key]).forEach(function (description) {
                    cy.get("th").each(($element) => {
                        if ($element.text() == description) {
                            cy.wrap($element).invoke('index').then((index) => {
                                cy.get("tbody").contains("tr", key).within(() => {
                                    cy.get("td").eq(index).invoke("text").should("not.include", language_variables[key][description]);
                                });
                            });
                        }
                    });
                });
            });
        });
        // Edit again and save
        cy.inputValue("Description", search_variables["Description"] + " - Edited");
        // Edit the language's description
        Object.keys(language_variables).forEach(function (key) {
            cy.get(tableSection["selector"]).first().within(() => {
                Object.keys(language_variables[key]).forEach(function (description) {
                    cy.get("th").each(($element) => {
                        if ($element.text() == description) {
                            cy.wrap($element).invoke('index').then((index) => {
                                cy.get("tbody").contains("tr", key).within(() => {
                                    cy.get("td").eq(index).type(language_variables[key][description])
                                });
                            });
                        }
                    });
                });
            });
        });
        cy.saveAndVerifySuccessfulMessage("The user notification type has been updated successfully.");
    });

    it("PA-15707 - User Notification Types - Search and Validate", () => {
        cy.inputValueByPlaceHolder("Search", search_variables["Description"] + " - Edited");
        resultTable.clickFirstRowInResultTable();
        cy.verifyInputtedValue("Description", search_variables["Description"] + " - Edited");
        // Validate languages' description
        cy.get(tableSection["selector"]).first().within(() => {
            cy.get("tr").its("length").should("be.gt", 1)
            Object.keys(language_variables).forEach(function (key) {
                Object.keys(language_variables[key]).forEach(function (description) {
                    cy.get("th").each(($element) => {
                        if ($element.text() == description) {
                            cy.wrap($element).invoke('index').then((index) => {
                                cy.get("tbody").contains("tr", key).within(() => {
                                    cy.get("td").eq(index).invoke("text").then(($text) => {
                                        expect($text).to.equal(language_variables[key][description])
                                    });
                                });
                            });
                        }
                    });
                });
            });
        });

    });

    it("PA-31594 - User Notification Types - Delete the Group", () => {
        // Click on Document Notification Groups tab
        cy.clickTab("Document Notification Groups");
        // Type in Search box
        cy.inputValueByPlaceHolder("Search", search_variables["Description"]);
        // Validate the description in result table
        configPage.verifyNotificationGroupIsAvailable("Description", search_variables["Description"]);
        // Delete it
        resultTable.deleteSpecificRowInResultTable(search_variables["Description"]);
        cy.verifySuccessMessagePopUp("The document notification group has been deleted successfully.");
        cy.clickTab("User Notification Types");
        cy.inputValueByPlaceHolder("Search", search_variables["Description"]);
        resultTable.verifyNoRecordsInResultTable();
    });
    
});