/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { DialogElements } from "../pages/DialogElements";
import { ResultTable } from "../pages/ResultTable";
import { SearchForm } from "../pages/SearchForm";
import { UIViewSection } from "../pages/UIViewSection";
import { getCurrentDateFormatted } from "../support/utils";

// Environment
const { portal } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const dialog = new DialogElements();
const resultTable = new ResultTable();
const searchForm = new SearchForm();
const uiView = new UIViewSection();

let legalPerson = "Legal Person";
const date = getCurrentDateFormatted("DD/MM/YYYY");
let randomNumber = `${Math.floor(Math.random() * 1000000)}`;
let type = "Call";
let note = `${type}-type Note created on ${date} ${randomNumber}`;
let handler = "Cypress User";

describe("Note - Call Type", () => {
    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("CView");
        mainNav.goTo("Legal Persons");
        searchForm.clickResetButton();
        searchForm.inputValue("Name", legalPerson);
        searchForm.clickSearchButton();
        resultTable.clickFirstRowInResultTable();
        // Click on Notes/Tasks tab
        uiView.waitForUIViewReady();
        uiView.clickTab("Notes");
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it("Note - Type: Call", () => {
        cy.getNotesListed().then(() => {
            cy.getNoteCounterFromTab().then((initialCounter) => {
                dialog.addNewNote(type, note);
                uiView.verifyLatestNote(type, note, handler, date, handler);
                cy.getNoteCounterFromTab().then((counter) => {
                    expect(counter-initialCounter).to.equal(1, "Counter from Tab as expected!");
                    cy.getNotesListed().then(newList => {
                        expect(counter).to.equal(newList, "Note List As expected!");
                    });
                });
            });
        });
    });

    it("PA-15751 - Note - View Call Details", () => {
        // View the first note in the list (which is also the one that we created)
        uiView.viewSpecificItem();
        // // It should contain the date and the number that we gave to it
        dialog.verifyInputtedTextEditor("Note", note);
    });

    it("PA-15753 - Note - Edit Call", () => {
        // Click on the first note in the list (which is also the one that we created)
        uiView.viewSpecificItem();
        dialog.clickButton("Edit");
        dialog.inputTextEditor("Note", `${note} - Edited`);
        dialog.save();
        cy.verifyPopUp("Note has been updated successfully.");
        // Verify if we can see the edited note in the list
        uiView.verifyLatestNote(type, `${note} - Edited`, handler, date, handler);
    });

});