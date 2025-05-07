/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { ResultTable } from "../pages/ResultTable";
import { MainNavigation } from "../pages/MainNavigation";
import { SearchForm } from "../pages/SearchForm";
import { ClaimPage } from "../pages/ClaimPage";
import { reverseDateFormat, removeAllSpace, getCurrentDateFormatted } from "../support/utils";

// Environment
const { portal, envValue, api } = Cypress.env();
// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const table = new ResultTable();
const searchForm = new SearchForm();
const claimPage = new ClaimPage();

let claimDetails = {
    claimId: "",
    latestObjectName: "",
    objectName: [],
    originalInsured: "",
    source: "",
    payer: "",
    claimLeader: "",
    eventDate: "",
    claimHandler: ""
};

/*
    Need to check the object which may have multiple versions
*/
describe('PA-15512 - Claims Search', () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            const currentDate = getCurrentDateFormatted("YYYY-MM-DD");
            cy.getClaimDetails(envValue, token, "2022-01-01", currentDate);
            cy.fixture(`${envValue}-claimDetails`).then((data) => {
                for (let index = 0; index < data.result.length; index++) {
                    let { object } = data.result[index];
                    if (object !== null) {
                        let { id } = data.result[index];
                        let { originalInsured } = data.result[index].coverageInformation;
                        let { source } = data.result[index].coverageInformation;
                        let { payer } = data.result[index].coverageInformation;
                        let { claimEvent } = data.result[index];
                        let { handler } = data.result[index];
                        claimDetails.claimId = id;
                        claimDetails.latestObjectName = object.name;
                        // Check if object having multiple versions ? 
                        cy.getAllObjectVersions(token, object.objectNumber).then(objectNames => {
                            let objNamesLength = objectNames.length;
                            if (objNamesLength === 1) {
                                claimDetails.objectName.push(object.name);
                            } else {
                                for (let version = 0; version < objNamesLength; version++) {
                                    cy.getObjectNameByVersionId(token, objectNames[version])
                                        .then(nameText => claimDetails.objectName.push(nameText));
                                }
                            }
                        });
                        claimDetails.originalInsured = originalInsured.name;
                        claimDetails.source = source.name;
                        claimDetails.payer = payer.name;
                        // convert shortName to Full name, i.e: WEA -> Web Admin.
                        cy.getSignatureDetails(envValue, token, handler);
                        cy.fixture(`${envValue}-${handler}Details`).then(details => {
                            claimDetails.claimHandler = details.name;
                        });
                        var eventDate = claimEvent.eventDate
                        claimDetails.eventDate = reverseDateFormat(eventDate).replaceAll("-", "/");
                        return false;
                    }
                }
                console.log(claimDetails);
            });
        });
    });

    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Claim Handling");
        mainNav.goTo("Claims");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it('Claim Search - Sortable Columns', { tags: ['smoke'] }, () => {
        searchForm.inputValue("Claim ID", claimDetails["claimId"].substring(0, 17) + "%");
        searchForm.clickSearchButton();
        cy.resultTableIsSortedBy("Claim ID"); //ascending
        cy.resultTableIsSortedBy("Claim ID"); //descending
        cy.resultTableIsSortedBy("Claim Text"); //ascending
        cy.resultTableIsSortedBy("Claim Text"); //descending
        cy.resultTableIsSortedBy("Object"); //ascending
        cy.resultTableIsSortedBy("Object"); //descending
        cy.resultTableIsSortedBy("Claim Handler"); //ascending
        cy.resultTableIsSortedBy("Claim Handler"); //descending
        cy.resultTableIsSortedBy("Interest"); //ascending
        cy.resultTableIsSortedBy("Interest"); //descending
        cy.resultTableIsSortedBy("Original Insured"); //ascending
        cy.resultTableIsSortedBy("Original Insured"); //descending 
    });

    it('Claim Search - Claim ID', { tags: ['smoke'] }, () => {
        searchForm.inputValue("Claim ID", removeAllSpace(claimDetails.claimId));
        searchForm.clickSearchButton();
        table.verifyAllRowsBasedOnColumHeader("Claim ID", claimDetails.claimId);
    });

    it('Claim Search - Claim ID - Verify Claim Information', { tags: 'main' }, () => {
        searchForm.inputValue("Claim ID", removeAllSpace(claimDetails.claimId));
        searchForm.clickSearchButton();
        table.verifyAllRowsBasedOnColumHeader("Claim ID", claimDetails.claimId);
        table.clickFirstRowInResultTable();
        claimPage.verifyInformation("Object", claimDetails.latestObjectName);
        claimPage.verifyInformation("Original Insured", claimDetails.originalInsured);
        claimPage.verifyInformation("Source", claimDetails.source);
        claimPage.verifyInformation("Payer", claimDetails.payer);
        // claimPage.verifyInformation("Claim Leader", claimDetails.claimLeader); // No displayed on the page anymore
        claimPage.verifyInformation("ID", claimDetails.claimId);
        claimPage.verifyInformation("Claim Date", claimDetails.eventDate);
        cy.clickButton("Back to Search Claims");
    });

    it('Claim Search - Claim ID - Verify Claim Fields', () => {
        searchForm.inputValue("Claim ID", removeAllSpace(claimDetails.claimId));
        searchForm.clickSearchButton();
        table.verifyAllRowsBasedOnColumHeader("Claim ID", claimDetails.claimId);
        table.clickFirstRowInResultTable();
        cy.clickLink("General Info");
        cy.contains('Event');
        cy.contains('Claim Date');
        cy.contains('Reported Date');

        // right panel
        cy.contains('Object');
        cy.contains('Original Insured');
        cy.contains('Source');
        cy.contains('Payer');
        // cy.contains('Claim Leader');
        cy.contains('Interest');
        cy.contains('Condition');
        cy.contains('Total');
        cy.contains('Our share');
        cy.contains('ID');
        cy.contains('Claim Date');
        cy.contains('Status');
        cy.contains('Total');
        cy.contains('Total 100%');
        cy.contains('Reserve');
        cy.contains('Reserve 100%');
        cy.contains('Settled');
        cy.contains('Settled 100%');
        cy.contains('Created');
        cy.contains('Updated');

        // Role tab
        claimPage.goToTab("Roles");
        cy.contains("Add role");
        table.verifyHeaderExisted("Role Type");
        table.verifyHeaderExisted("Legal Person");
        table.verifyHeaderExisted("Reference");
        // table.verifyHeaderExisted("Area Code"); // Not Applicable 
        table.verifyHeaderExisted("Note");
        table.verifyHeaderExisted("Action");

        // Document tab
        // claimPage.goToTab("Documents");
        // cy.contains('Documents');
        // table.verifyHeaderExisted('File Name');
        // table.verifyHeaderExisted('Display Name');
        // table.verifyHeaderExisted('Reference');
        // table.verifyHeaderExisted('Description');
        // table.verifyHeaderExisted('Action');
        cy.clickButton("Back to Search Claims");
    });

    it('Claim Search - Object', () => {
        searchForm.selectValue("Object", claimDetails.latestObjectName);
        searchForm.clickSearchButton();
        table.verifyMultipleObjectVersionsInResultTable("Object", claimDetails.objectName);
    });

    it('Claim Search - Original Insured', () => {
        searchForm.selectValue("Original Insured", claimDetails.originalInsured);
        searchForm.clickSearchButton();
        table.verifyAllRowsBasedOnColumHeader("Original Insured", claimDetails.originalInsured);
    });

    it('Claim Search - Date Range', () => {
        cy.inputValue("From Date", claimDetails.eventDate);
        cy.inputValue("To Date", "d");
        searchForm.clickSearchButton();
        table.verifyResultsReturned();
    });

    it('Claim Search - Claim Handler', () => {
        searchForm.selectValue("Claim Handler", claimDetails.claimHandler);
        searchForm.clickSearchButton();
        table.verifyAllRowsBasedOnColumHeader("Claim Handler", claimDetails.claimHandler);
    });

    // Working on 
    it('PA-33608 - Verify Buttons', () => {
        searchForm.inputValue("Claim ID", removeAllSpace(claimDetails.claimId));
        searchForm.clickSearchButton();
        table.verifyAllRowsBasedOnColumHeader("Claim ID", claimDetails.claimId);
        table.clickFirstRowInResultTable();
        claimPage.verifyInformation("Object", claimDetails.latestObjectName);
        claimPage.verifyInformation("Original Insured", claimDetails.originalInsured);
        claimPage.verifyInformation("Source", claimDetails.source);
        claimPage.verifyInformation("Payer", claimDetails.payer);
        claimPage.verifyInformation("ID", claimDetails.claimId);
        claimPage.verifyInformation("Claim Date", claimDetails.eventDate);        
        cy.clickButton("Back to Search Claims");
    });

});