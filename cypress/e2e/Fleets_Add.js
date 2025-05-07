/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { ResultTable } from "../pages/ResultTable";
import { SearchForm } from "../pages/SearchForm";
import { getCurrentDateFormatted } from "../support/utils";

// Environment
const { portal, envValue, api } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const searchForm = new SearchForm();
const resultTable = new ResultTable();

const currentDate = getCurrentDateFormatted("DD-MM-YYYY");
let randomNumber = `${Math.floor(Math.random() * 10000)}`

let fleetDetail = {
    "Name": `Automated Fleet ${currentDate} ${randomNumber}`,
    "Updated Name": `Automated Fleet updated ${currentDate} ${randomNumber}`,
    "Client Advocate": "",
    "Contact Person": "",
    "Note": "This is just a dummy fleet created by automation test",
    "Updated Note": "This is just a dummy fleet updated by automation test",
    "Status": "Prospect"
}

describe('Broker - Fleet', () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            cy.getFleetDetails(token).then((data) => {
                let index = 0;
                const { contactPerson, clientAdvocate } = data.result[index];
                fleetDetail["Client Advocate"] = clientAdvocate;
                fleetDetail["Contact Person"] = contactPerson.name;                
                cy.getSignatureDetails(envValue, token, clientAdvocate);
                console.log(fleetDetail);           
            }).then(() => {
                let file = `${envValue}-${fleetDetail["Client Advocate"]}Details`;
                cy.fixture(file).then(details => {
                    fleetDetail["Client Advocate"] = details.name;
                });
            });        
        });
    });

    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Broker");
        mainNav.goTo("Fleets");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it('PA-15828 - Broker - Fleets - Create', () => {
        cy.clickButton("Create");
        cy.contains("General Info");
        cy.inputValue("Name", fleetDetail['Name']);
        cy.selectValue("Client Advocate", fleetDetail['Client Advocate']);
        cy.selectValue("Contact person", fleetDetail['Contact Person']);
        cy.inputValueForTextArea("Note", fleetDetail['Note']);
        cy.saveAndVerifySuccessfulMessage("Fleet has been created successfully.");
    });

    it('PA-15829 - Broker - Fleets - Verify Newly Created Fleet', () => {
        searchForm.inputValue("Name", fleetDetail['Name']);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Name", fleetDetail['Name']);
        resultTable.verifyAllRowsBasedOnColumHeader("Client Advocate", fleetDetail['Client Advocate']);
        resultTable.clickFirstRowInResultTable();
        cy.verifyInputtedValue("Name", fleetDetail['Name']);
        cy.verifySelectedValue("Client Advocate", fleetDetail['Client Advocate']);
        cy.verifySelectedValue("Contact person", fleetDetail['Contact Person']);
        cy.verifySelectedValue("Status", fleetDetail["Status"]);
    });

    it('PA-15830 - Broker - Fleets - Edit Fleet', () => {
        searchForm.inputValue("Name", fleetDetail['Name']);
        searchForm.clickSearchButton();
        resultTable.clickFirstRowInResultTable();
        cy.clickButton("Edit");
        cy.inputValue("Name", fleetDetail['Updated Name']);
        cy.inputValueForTextArea("Note", fleetDetail['Updated Note']);
        cy.saveAndVerifySuccessfulMessage("Fleet has been updated successfully.");
        mainNav.goTo("Fleets");
        searchForm.inputValue("Name", fleetDetail['Updated Name']);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Name", fleetDetail['Updated Name']);
        resultTable.verifyAllRowsBasedOnColumHeader("Client Advocate", fleetDetail['Client Advocate']);
        resultTable.clickFirstRowInResultTable();
        cy.verifyInputtedValue("Name", fleetDetail['Updated Name']);
        cy.verifySelectedValue("Client Advocate", fleetDetail['Client Advocate']);
        cy.verifySelectedValue("Contact person", fleetDetail['Contact Person']);
        cy.verifySelectedValue("Status", fleetDetail["Status"]);
    });

});