/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { DialogElements } from "../pages/DialogElements";
import { SearchForm } from "../pages/SearchForm";
import { ResultTable } from "../pages/ResultTable";
import { ObjectsPage } from "../pages/ObjectsPage";

// Environment
const { portal , api , envValue } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const dialog = new DialogElements();
const searchForm = new SearchForm();
const resultTable = new ResultTable();
const objectsPage = new ObjectsPage();

const file1 = "mocknote1.txt"
const file2 = "mocknote2.txt"
let offerDetail = {
    "Original Insured" : "",
    "Text" : "",
    "Number" : ""
}
describe("Broker - Offers - Attachment", () => {
    before(() => {
        // Prepare the file to upload it in the upcoming test
        cy.writeFile(`cypress/fixtures/${file1}`, "This is just a test document 1");
        cy.writeFile(`cypress/fixtures/${file2}`, "This is just a test document 2");
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            cy.getOfferAgreementDetails(envValue, token);
            cy.fixture(`${envValue}-offerAgreementDetails`).then((data) => {
                const { agreement, text } = data.result[0];
                offerDetail["Original Insured"] = agreement.originalInsured["name"];
                offerDetail["Number"] = agreement["number"];
                offerDetail["Text"] = text;                
                console.log(offerDetail);
            });
        });
    });

    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Broker");
        mainNav.goTo("Offers");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it("PA-15746 - Broker - Offers - Attachments - Attach File", () => {
        searchForm.inputValue("Number", offerDetail["Number"]);   
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Original Insured", offerDetail["Original Insured"]);
        resultTable.verifyAllRowsBasedOnColumHeader("Text", offerDetail["Text"]);
        resultTable.clickFirstRowInResultTable();
        // Click on Attachments tab
        cy.clickLink("Attachments");
        resultTable.deleteAttachmentsIfAny();
        // Upload file
        cy.uploadFile(file1);
        // Input fields on the dialog
        dialog.inputValue("Display Name", "Broker Notes");
        dialog.inputValue("Reference", "Attachment Reference");
        dialog.inputValueForTextArea("Attachment Description");
        dialog.clickButton("Upload");
        cy.waitForUploadCompleted();
        resultTable.verifyAllRowsBasedOnColumHeader("Description", "Attachment Description");
        resultTable.verifyAllRowsBasedOnColumHeader("Reference", "Attachment Reference");
        resultTable.performSpecificActionInResultTable("Attachment Reference", "Cancel");
        cy.verifyPopUp("Attachment was successfully cancelled");
    });

    it("Broker - Offers - Attachments - Attach Multiple Files", () => {
        searchForm.inputValue("Number", offerDetail["Number"]);   
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Original Insured", offerDetail["Original Insured"]);
        resultTable.verifyAllRowsBasedOnColumHeader("Text", offerDetail["Text"]);
        resultTable.clickFirstRowInResultTable();
        // Click on Attachments tab
        cy.clickLink("Attachments");
        resultTable.deleteAttachmentsIfAny();
        // Upload file
        cy.uploadFile(file1, file2);
        // Input fields on the dialog
        dialog.inputValue("Reference", "Attachment Reference");
        dialog.inputValueForTextArea("Attachment Description");
        dialog.clickButton("Upload");
        cy.waitForUploadCompleted();
        resultTable.verifyAllRowsBasedOnColumHeader("Description", "Attachment Description");
        resultTable.verifyAllRowsBasedOnColumHeader("Reference", "Attachment Reference");
        resultTable.performSpecificActionInResultTable("Attachment Reference", "Cancel");
        cy.verifyPopUp("Attachment was successfully cancelled");
        resultTable.performSpecificActionInResultTable("Attachment Reference", "Cancel");
        cy.verifyPopUp("Attachment was successfully cancelled");
    });

    it("Broker - Offers - Attachments - Change Info from Action Menu", () => {
        searchForm.inputValue("Number", offerDetail["Number"]);   
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Original Insured", offerDetail["Original Insured"]);
        resultTable.verifyAllRowsBasedOnColumHeader("Text", offerDetail["Text"]);
        resultTable.clickFirstRowInResultTable();
        // Click on Attachments tab
        cy.clickLink("Attachments");
        resultTable.deleteAttachmentsIfAny();
        // Upload file
        cy.uploadFile(file1);
        // Input fields on the dialog
        dialog.inputValue("Display Name", "Broker Notes");
        dialog.inputValue("Reference", "Attachment Reference");
        dialog.inputValueForTextArea("Attachment Description");
        dialog.clickButton("Upload");
        cy.waitForUploadCompleted();
        resultTable.verifyAllRowsBasedOnColumHeader("Description", "Attachment Description");
        resultTable.verifyAllRowsBasedOnColumHeader("Reference", "Attachment Reference");
        resultTable.performSpecificActionInResultTable("Attachment Reference", "Change Info");
        dialog.inputValue("Reference", "Updated Reference");
        dialog.save();
        resultTable.verifyAllRowsBasedOnColumHeader("Reference", "Updated Reference");
        resultTable.performSpecificActionInResultTable("Updated Reference", "Cancel");
        cy.verifyPopUp("Attachment was successfully cancelled");
        resultTable.verifyNoRecordsInResultTable();
    });

    it("Broker - Offers - Attachments - Change Info from Column", () => {
        searchForm.inputValue("Number", offerDetail["Number"]);   
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Original Insured", offerDetail["Original Insured"]);
        resultTable.verifyAllRowsBasedOnColumHeader("Text", offerDetail["Text"]);
        resultTable.clickFirstRowInResultTable();
        // Click on Attachments tab
        cy.clickLink("Attachments");
        resultTable.deleteAttachmentsIfAny();
        // Upload file
        cy.uploadFile(file2);
        // Input fields on the dialog
        dialog.inputValue("Display Name", "Broker Notes");
        dialog.inputValue("Reference", "Attachment Reference");
        dialog.inputValueForTextArea("Attachment Description");
        dialog.clickButton("Upload");
        cy.waitForUploadCompleted();
        resultTable.verifyAllRowsBasedOnColumHeader("Description", "Attachment Description");
        resultTable.verifyAllRowsBasedOnColumHeader("Reference", "Attachment Reference");
        objectsPage.editDescription("Attachment Description", "Updated Description");
        resultTable.verifyAllRowsBasedOnColumHeader("Description", "Updated Description");
        cy.wait(1000);
        resultTable.performSpecificActionInResultTable("Attachment Reference", "Cancel");
        cy.verifyPopUp("Attachment was successfully cancelled");
        resultTable.verifyNoRecordsInResultTable();
    });
    
});