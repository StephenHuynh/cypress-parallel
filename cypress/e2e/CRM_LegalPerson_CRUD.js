/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { DialogElements } from "../pages/DialogElements";
import { SearchForm } from "../pages/SearchForm";
import { ResultTable } from "../pages/ResultTable";
import { UIViewSection } from "../pages/UIViewSection";
import { RightInformationPanel } from "../pages/RightInformationPanel";
import { getCurrentDateFormatted } from "../support/utils";

// Environment
const { portal } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const dialog = new DialogElements();
const searchForm = new SearchForm();
const resultTable = new ResultTable();
const uiView = new UIViewSection();
const informationPanel = new RightInformationPanel();

let randomNumber = `${Math.floor(Math.random() * 1000000)}`;
let currentDate = getCurrentDateFormatted("DD/MM/YYYY");
let personDetail = { 
    "Name": `Legal Person ${randomNumber}`,
    "Short Name": "Short Name",
    "Street Address": "Ha Phan Building",
    "Postal": "HCM",
    "Country": "Vietnam",    
    "Specification": "Single Person",
    "Email": `notanemail${randomNumber}@mail.no`,
    "Phone": "+01 999 876 123"
}
let taskDetail = {
    "Task Title": `Auto Title ${randomNumber}`,
    "Task Note": `${randomNumber} Auto Exe. Note`,
    "Task Status": "Todo",
    "Created User": "Cypress User",
    "Due Date": ""
}

let type = "Customer (dir)";

let insuranceDetails = {
    "Owner Id": "4880",
    "Owner Name": "aa",
}

describe("CView - Legal Persons - Contact", () => {
    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("CView");
        mainNav.goTo("Legal Persons");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it("PA-15501 - CView - Legal Persons - Insurances", () => {
        searchForm.inputValue("Id", insuranceDetails['Owner Id']);
        searchForm.verifySearchCriteria("Id", insuranceDetails['Owner Id']);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Id", insuranceDetails['Owner Id']);
        resultTable.verifyAllRowsBasedOnColumHeader("Name", insuranceDetails['Owner Name']);
        resultTable.viewLegalPersonCViewByName(insuranceDetails['Owner Name']);
        cy.waitForPopUpDisappeared();
        uiView.clickTab("Insurances");
        searchForm.inputValue("From year", "2000");
        searchForm.verifySearchCriteria("From year", "2000");
        searchForm.clickSearchButton();
        resultTable.verifyResultsReturned();
    });

    it("PA-15729 - CView - Legal Persons - Create a Contact", () => {
        cy.clickButton("Create");
        dialog.selectValue("Type", type);
        dialog.clickButton("Next");
        cy.waitForPopUpDisappeared();
        cy.waitForPageLoaded();
        Object.keys(personDetail).forEach(function (key) {
            if (key.includes("Specification")) {
                cy.selectValue(key, personDetail[key]);
            } else {
                cy.inputValue(key, personDetail[key]);
            }
        });
        cy.generateSSN().then(ssn => cy.inputValue("SSN", ssn));
        cy.intercept("POST", "**POST*persons*").as("save");
        cy.clickButton("Save");
        cy.waitForRequest("save");
        cy.verifyPopUp("Legal Person has been created successfully.");
    });

    it("PA-15728 - CView - Legal Persons - View and Verify Details", () => {
        searchForm.inputValue("Name", personDetail['Name']);
        searchForm.verifySearchCriteria("Name", personDetail['Name']);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Name", personDetail['Name']);
        resultTable.viewLegalPersonByName(personDetail['Name']);
        cy.waitForPopUpDisappeared();
        cy.clickButton("Edit");
        informationPanel.verifyInformation("Version status", "Active");
        informationPanel.verifyInformation("Type", type);
        informationPanel.verifyInformation("Name", personDetail['Name']);
        informationPanel.verifyInformation("Short Name", personDetail['Short Name']);
        informationPanel.verifyInformation("Stop Use", "No");
        informationPanel.verifyInformation("Invisible", "No");
        cy.clickButton("Cancel");
    });

    it("PA-15499 - PA-15500 - CView - Legal Persons - View and Verify CView Details", () => {
        searchForm.inputValue("Name", personDetail['Name']);
        searchForm.verifySearchCriteria("Name", personDetail['Name']);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Name", personDetail['Name']);
        resultTable.viewLegalPersonCViewByName(personDetail['Name']);
        cy.waitForPopUpDisappeared();
        uiView.clickTab("Profile");
        uiView.verifyLegalPersonHeaderName(personDetail['Name']);        
        uiView.verifyBusinessCardInformation("Email", personDetail['Email']);
        uiView.verifyBusinessCardInformation("Phone", personDetail['Phone']);
        uiView.verifyBusinessCardInformation("Type", type);
        // cy.clickButton("New Task");
        // dialog.inputValue("Title", taskDetail['Task Title']);
        // // New change from Version:	develop-202501130847
        // dialog.selectValue("Status", taskDetail['Task Status']);
        // dialog.inputTextEditor("Note", taskDetail['Task Note']);
        // cy.getInputtedValueFromDialog("Due date").then(
        //     date => taskDetail["Due Date"] = date);
        // dialog.save();
        // cy.verifyPopUp("Task has been created successfully.");
        // mainNav.goTo("Legal Persons");
        // searchForm.clickResetButton();
        // searchForm.inputValue("Name", personDetail['Name']);
        // searchForm.clickSearchButton();
        // resultTable.verifyAllRowsBasedOnColumHeader("Name", personDetail['Name']);
        // resultTable.viewLegalPersonCViewByName(personDetail['Name']);
        // cy.waitForPopUpDisappeared();
        // cy.wait(2000);
        // uiView.verifyLatestTask(taskDetail['Task Title'], 
        //     taskDetail['Task Note'], 
        //     taskDetail['Created User'], 
        //     taskDetail['Task Status'],
        //     taskDetail["Due Date"]);
    });

    it("PA-15730 - CView - Legal Persons - Update a Contact", () => {
        searchForm.inputValue("Name", personDetail['Name']);
        searchForm.verifySearchCriteria("Name", personDetail['Name']);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Name", personDetail['Name']);
        resultTable.viewLegalPersonByName(personDetail['Name']);
        cy.waitForPopUpDisappeared();
        cy.clickButton("Edit");
        cy.intercept("PUT", "**PUT*persons*").as("save");
        cy.inputValue("Short Name", "Updated");
        cy.clickButton("Save");
        cy.waitForRequest("save");
        cy.verifyPopUp("Legal Person has been updated successfully.");
        appLauncher.navigateToApp("CView");
        mainNav.goTo("Legal Persons");
        searchForm.clickResetButton();    
        searchForm.inputValue("Short Name", "Updated");
        searchForm.verifySearchCriteria("Short Name", "Updated");
        searchForm.clickSearchButton();    
        resultTable.verifyAllRowsBasedOnColumHeader("Short Name", "Updated");
    });
    
});