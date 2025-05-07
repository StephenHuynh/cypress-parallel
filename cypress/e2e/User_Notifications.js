/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { SearchForm } from "../pages/SearchForm";
import { ResultTable } from "../pages/ResultTable";
import { DialogElements } from "../pages/DialogElements";
import { substringToLastIndex } from "../support/utils";

// Environment
const { portal, api } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const searchForm = new SearchForm();
const resultTable = new ResultTable();
const dialog = new DialogElements();

let search_variables = {
    "Status": "",
    "Send type": "",
    "Notification type": ""
}

describe("User Notifications", () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
                cy.getUserNotifications(token)
                    .then((res) => {
                        search_variables["Status"] = substringToLastIndex(res.result[0].status, 0, "_");
                        search_variables["Send type"] = substringToLastIndex(res.result[0].sendType, 0, "_");
                        search_variables["Notification type"] = substringToLastIndex(res.result[0].userNotificationType, 0, "_");
                });
            });
        });

    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Self Service");
        mainNav.goTo("User Notifications");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it(`PA-15687/15688 - User Notifications - Search for Status`, () => {
        searchForm.selectValue("Status", search_variables["Status"]);
        // Checking if Certificate is available in table
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Status", search_variables["Status"]);
        resultTable.clickFirstRowInResultTable();
        dialog.verifyTitle("User Notifications");
        cy.get(dialog.dialogViewPortSelector).contains(search_variables["Status"], {matchCase: false});
        dialog.clickButton("Close");
        resultTable.clickFirstRowBasedOn("Legal Person");
        cy.waitForPopUpDisappeared();
        cy.waitForPageLoaded();
        dialog.verifyTitle("Legal Person Details");
        dialog.closeLegalPersonDetailsPopUp();
    });

    it(`PA-15687/15688 - User Notifications - Search for Send Type`, () => {
        searchForm.selectValue("Send type", search_variables["Send type"]);
        // Checking if Certificate is available in table
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Send type", search_variables["Send type"]);
    });

    it.skip(`PA-15687/15688 - User Notifications - Search for Notification Type`, () => {
        searchForm.selectValue("Status", search_variables["Status"]);
        searchForm.selectValue("Notification type", search_variables["Notification type"]);
        // Checking if Certificate is available in table
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Status", search_variables["Status"]);
        resultTable.verifyAllRowsBasedOnColumHeader("Notification type", search_variables["Notification type"]);
    });

    /**
     * Status : Skip
     * Reason : No Data Available
     */
    it.skip(`PA-15687/15688 - User Notifications - Search for Notification Type`, () => {
        searchForm.selectValue("Status", search_variables["Status"]);
        searchForm.selectValue("Notification type", search_variables["Notification type"]);
        // Checking if Certificate is available in table
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Status", search_variables["Status"]);
        resultTable.verifyAllRowsBasedOnColumHeader("Notification type", search_variables["Notification type"]);
        resultTable.clickFirstRowBasedOn("Data");
        cy.waitForPageLoaded();
        cy.url().should("contain", "message");
        mainNav.goTo("User Notifications");
        searchForm.clickResetButton();
        searchForm.selectValue("Status", search_variables["Status"]);
        searchForm.selectValue("Notification type", "Submission proc");
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Status", search_variables["Status"]);
        resultTable.verifyAllRowsBasedOnColumHeader("Notification type", "Submission proc");
        resultTable.clickFirstRowBasedOn("Data");
        cy.waitForPageLoaded();
        cy.url().should("contain", "submission");
        // There's no data to test "Document approv"
        /*
        mainNav.goTo("User Notifications");
        searchForm.clickResetButton();
        searchForm.selectValue("Status", search_variables["Status"]);
        searchForm.selectValue("Notification type", "Document approv");
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Status", search_variables["Status"]);
        resultTable.verifyAllRowsBasedOnColumHeader("Notification type", "Document approv");
        resultTable.clickFirstRowBasedOn("Data");
        cy.waitForPageLoaded();
        cy.url().should("contain", "document"); */
    });
    
});