/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { NewsPage } from "../pages/NewsPage";
import { ResultTable } from "../pages/ResultTable";
import { SearchForm } from "../pages/SearchForm";
import { getCurrentDateFormatted } from "../support/utils";
import { DialogElements } from "../pages/DialogElements";

// Environment
const { portal } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const resultTable = new ResultTable();
const searchForm = new SearchForm();
const newsPage = new NewsPage();
const dialog = new DialogElements();

const currentDate = getCurrentDateFormatted("DD-MM-YYYY HH.MM.SS");
const description = "QA Automation has started to create test cases for multiple modules in Paris web";
const content = "Since the beginning of 2020, QA team has started to create automation test cases for multiple modules in Paris web. Up to this point, they have covered 6 modules, including Admin, Broker, Claim Handling, Self Service, CRM and Noria Cloud. Although these test cases are only so-called smoke tests, but this is a really good starting point for Noria Software and for the team specifically.";
const language = "English";
let newsType = "Inline article";
let title = `${newsType} news ${currentDate}`;

describe(`News Creation - Inline article News`, () => {
    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Self Service")
        mainNav.goTo("News");
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it("PA-15696 - News Creation - Create Inline article News", () => {
        searchForm.clickAddButton();
        cy.inputValue("Title", title);
        cy.checkRadioButton("Type", newsType);
        cy.inputValueForTextArea("Description", description);
        cy.selectValue("Language", language);
        newsPage.enterTextForCKEditor(content);
        cy.intercept("POST", "**plugin=SaveNews*").as('save');
        cy.clickButton("Save");
        cy.wait('@save').its("response.statusCode").should('eq', 200);
        cy.verifyPopUp("News has been created successfully!");
    });

    it("PA-15694 - News Creation - Search Inline article News", () => {
        searchForm.inputValue("Title", title);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Title", title);
    });

    it("PA-15695 - News Creation - View Inline article News Details", () => {
        searchForm.waitForSearchCompleted(20);
        searchForm.inputValue("Title", title);
        searchForm.clickSearchButton();
        resultTable.viewSpecificRowInResultTable(title);
        cy.verifyInputtedValue("Title", title);
        cy.verifyInputtedTextArea("Description", description);
        cy.verifySelectedValue("Language", language);
        cy.verifyInputtedTextForCKEditor(content);
    });

    it("PA-15697 - News Creation - Edit/Update Inline article News", () => {
        searchForm.inputValue("Title", title);
        searchForm.clickSearchButton();
        resultTable.waitForResultTableLoaded();
        cy.intercept("GET", "**plugin=GetNews*").as('getNews');
        // Click on that news to view its details
        resultTable.viewSpecificRowInResultTable(title);
        cy.wait('@getNews').its("response.statusCode").should('eq', 200);
        // Edit the news
        cy.clickButton("Edit");
        cy.inputValue("Title", title + " - Edited");
        cy.inputValueForTextArea("Description", description + " - Edited");
        cy.intercept("POST", "**plugin=SaveNews*").as('save');
        cy.clickButton("Save");
        cy.wait('@save').its("response.statusCode").should('eq', 200);
        cy.verifyPopUp("News has been updated successfully!");
    });

    it("PA-15694 - News Creation - Search The Edited Inline article News", () => {
        // Search for the news and validate if its title has been changed
        searchForm.inputValue("Title", title + " - Edited");
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Title", title + " - Edited");
    });

    it("News Creation - Validate Inline article News Details", () => {
        // Search for the news and validate if its title has been changed
        searchForm.inputValue("Title", title + " - Edited");
        searchForm.clickSearchButton();
        resultTable.waitForResultTableLoaded();
        // Click on it and validate if all the fields have the edited text
        resultTable.viewSpecificRowInResultTable(title + " - Edited");
        // Validate information of the news
        cy.verifyInputtedValue("Title", title + " - Edited");
        cy.verifyInputtedTextArea("Description", description + " - Edited");
    });

    it("PA-15700 - News Creation - Update Inline article News Status", () => {
        // Verify News status from Search Page  
        searchForm.inputValue("Title", title + " - Edited");
        searchForm.selectValue("Status", "Unpublished");
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Status", "Unpublished");
        resultTable.performSpecificActionInResultTable(title + " - Edited", "Publish");
        // Disable because of News Channel Feature disabled
        dialog.checkCheckbox("Facebook");
        cy.intercept("POST", "**plugin=SaveNews*").as('save');
        dialog.clickButton("Save");
        cy.wait('@save').its("response.statusCode").should('eq', 200);
        cy.verifyPopUp("News has been updated successfully!");
        searchForm.removeSearchCriteria("Status");
        searchForm.waitForSearchCompleted();
        resultTable.verifyAllRowsBasedOnColumHeader("Status", "Published");
        // Verify News status from Details Page  
        resultTable.viewSpecificRowInResultTable(title + " - Edited");
        cy.clickButton("Edit");
        newsPage.verifyNewsStatus("Published");
    });

    it("PA-15698 - News Creation - Delete the Inline article News", () => {
        // Search for it and delete it
        searchForm.inputValue("Title", title + " - Edited");
        searchForm.clickSearchButton();
        cy.intercept("POST", "**plugin=DeleteNews*").as('delete');
        resultTable.deleteSpecificRowInResultTable(title + " - Edited");
        cy.wait('@delete').its("response.statusCode").should('eq', 200);
        cy.verifyPopUp("has been deleted successfully!");
        searchForm.clickResetButton();
        searchForm.inputValue("Title", title + " - Edited");
        searchForm.clickSearchButton();
        resultTable.verifyNoRecordsInResultTable();
    });
});