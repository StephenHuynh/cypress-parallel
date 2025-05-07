/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { ResultTable } from "../pages/ResultTable";
import { SearchForm } from "../pages/SearchForm";
import { DialogElements } from "../pages/DialogElements";

// Environment
const { portal, api, envValue } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const resultTable = new ResultTable();
const searchForm = new SearchForm();
const dialog = new DialogElements();

let agreementDetail = {
    "Name": "",
}

const file1 = "agreementFile01.txt";

describe("Broker - Agreement Attachment", () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            cy.getAgreementDetails(envValue, token, "Add Object %");
            cy.fixture(`${envValue}-agreementDetails`).then((data) => {
                const { number } = data.result[0];
                agreementDetail["Number"] = number.toString();
                console.log(agreementDetail);
            });
        });
        // Prepare the file to upload it in the upcoming test
        cy.writeFile(`cypress/fixtures/${file1}`, "This is just an agreement document 1");
    });

    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Broker");
        mainNav.goTo("Agreements");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it("PA-24815 - Broker - Agreements - Attachment", () => {
        searchForm.inputValue("Number", agreementDetail["Number"]);
        searchForm.verifySearchCriteria("Number", agreementDetail["Number"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Number", agreementDetail["Number"]);
        resultTable.clickFirstRowInResultTable();
        cy.clickTab("Attachments");
        resultTable.verifyHeaderExisted("ID");
        resultTable.verifyHeaderExisted("File Name");
        resultTable.verifyHeaderExisted("Description");
        resultTable.verifyHeaderExisted("Reference");
        resultTable.verifyHeaderExisted("Category");
        resultTable.verifyHeaderExisted("Created");
        resultTable.verifyHeaderExisted("Action");
        resultTable.deleteAttachmentsIfAny();
        // Upload file
        cy.uploadFile(file1);
        // Input fields on the dialog
        dialog.inputValue("Display Name", "Broker Notes");
        dialog.inputValue("Reference", "Attachment Reference");
        dialog.inputValueForTextArea("Attachment Desc");
        dialog.clickButton("Upload");
        cy.waitForUploadCompleted();
        resultTable.verifyAllRowsBasedOnColumHeader("File Name", file1);
        resultTable.verifyAllRowsBasedOnColumHeader("Description", "Attachment Desc");
        resultTable.verifyAllRowsBasedOnColumHeader("Reference", "Attachment Reference");
        // Check it later
        // cy.viewAttachedFileAndVerifyContent("File Name", file1, "This is just an agreement document 1");
        resultTable.performSpecificActionInResultTable("Attachment Reference", "Cancel");
        cy.verifyPopUp("Attachment was successfully cancelled");
        resultTable.verifyNoRecordsInResultTable();
        cy.clickButton("Back to Search Agreements");
    });

    it("Broker - Agreements - Attachment - Change Info from Action Menu", () => {
        searchForm.inputValue("Number", agreementDetail["Number"]);
        searchForm.verifySearchCriteria("Number", agreementDetail["Number"]);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Number", agreementDetail["Number"]);
        resultTable.clickFirstRowInResultTable();
        cy.clickTab("Attachments");
        resultTable.deleteAttachmentsIfAny();
        // Upload file
        cy.uploadFile(file1);
        // Input fields on the dialog
        dialog.inputValue("Display Name", "Broker Notes");
        dialog.inputValue("Reference", "Attachment Reference");
        dialog.inputValueForTextArea("Attachment Desc");
        dialog.clickButton("Upload");
        cy.waitForUploadCompleted();
        resultTable.verifyAllRowsBasedOnColumHeader("File Name", file1);
        resultTable.verifyAllRowsBasedOnColumHeader("Description", "Attachment Desc");
        resultTable.verifyAllRowsBasedOnColumHeader("Reference", "Attachment Reference");        
        resultTable.performSpecificActionInResultTable("Attachment Reference", "Change Info");
        dialog.inputValue("Reference", "Updated Reference");
        dialog.save();
        cy.verifyPopUp("Attachment has been updated successfully");
        resultTable.verifyAllRowsBasedOnColumHeader("Reference", "Updated Reference");
        resultTable.performSpecificActionInResultTable("Updated Reference", "Cancel");
        cy.verifyPopUp("Attachment was successfully cancelled");
        resultTable.verifyNoRecordsInResultTable();
        cy.clickButton("Back to Search Agreements");
    });

});