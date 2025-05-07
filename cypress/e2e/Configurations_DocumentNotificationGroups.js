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

// Data
const currentDate = getCurrentDateFormatted("DD-MM-YYYY");
let description = `Notification Group ${currentDate}`;
let documentType = "Certificate";

describe("Document Notification Group", () => {
    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Self Service");
        mainNav.goTo("Configurations");
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it("PA-15704 - Document Notification Group - Create a Group", () => {
        // Checking if Certificate is available in table
        configPage.deleteNotificationGroup(documentType);
        cy.clickButton("Add Group");
        cy.inputValue("Description", description);
        configPage.selectDocumentType(documentType);
        configPage.addDocumentType();
        cy.saveAndVerifySuccessfulMessage("The document notification group has been created successfully.");
    });

    it("PA-15702 - Document Notification Group - Validate Sort Feature", () => {
        resultTable.waitForResultTableLoaded();
        cy.resultTableIsSortedBy("Description"); //ascending
        cy.resultTableIsSortedBy("Description"); //descending
        cy.resultTableIsSortedBy("ID", "Numeric"); //ascending
        cy.resultTableIsSortedBy("ID", "Numeric"); //descending
    });

    it("PA-15702 - Document Notification Group - Search and Validate the Description", () => {
        // Type in Search box
        cy.inputValueByPlaceHolder("Search", description);
        resultTable.waitForResultTableLoaded();
        resultTable.verifyAllRowsBasedOnColumHeader("Description", description);
    });

    it("PA-15703 - Document Notification Group - View and Validate", () => {
        // Type in Search box
        cy.inputValueByPlaceHolder("Search", description);
        resultTable.viewSpecificRowInResultTable(description);
        resultTable.verifyAllRowsBasedOnColumHeader("Document Type Name", documentType);
    });

    it("PA-15705 - Document Notification Group - Search and Edit", () => {
        // Type in Search box
        cy.inputValueByPlaceHolder("Search", description);
        resultTable.viewSpecificRowInResultTable(description);
        cy.clickButton("Edit");
        cy.inputValue("Description", description + " - Edited");
        cy.saveAndVerifySuccessfulMessage("The document notification group has been updated successfully.");
    });

    it("PA-15706 - Document Notification Group - Delete The Group", () => {
        // Type in Search box
        cy.inputValueByPlaceHolder("Search", description + " - Edited");
        // Validate the description in result table
        resultTable.verifyAllRowsBasedOnColumHeader("Description", description + " - Edited");
        // Delete it
        resultTable.deleteSpecificRowInResultTable(description + " - Edited");
        cy.verifySuccessMessagePopUp("The document notification group has been deleted successfully.");
    });

});