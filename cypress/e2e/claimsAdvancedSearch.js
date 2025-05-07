/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { SearchForm } from "../pages/SearchForm";
import { ResultTable } from "../pages/ResultTable";
import { getCurrentDateFormatted , getValueFromInterestList , getValueFromArrayOfObject } from "../support/utils";

// Environment
const { portal, envValue, api } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const searchForm = new SearchForm();
const resultTable = new ResultTable();

let claimDetails = {
    created: "",
    office: "",
    division: "",
    businessClass: "",
    interest: "",
    eventDesc: "",
    rolePerson: "",
    originalInsured: ""
};

describe('PA-15512 - Claims Advanced Search', () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            const currentDate = getCurrentDateFormatted("YYYY-MM-DD");
            cy.getClaimDetails(envValue, token, "2022-01-01", currentDate);
            cy.fixture(`${envValue}-claimDetails`).then((data) => {
                let index = 0;
                let { originalInsured } = data.result[index].coverageInformation;
                let { busnDivision } = data.result[index].coverageInformation;
                let { busnClass } = data.result[index].coverageInformation;
                let { interest } = data.result[index].coverageInformation;
                let { source } = data.result[index].coverageInformation;
                let { agreementType } = data.result[index].coverageInformation;
                let { description } = data.result[index].claimEvent;
                claimDetails.created = data.result[index].created;

                cy.getOffices(token).then((offices) => {
                    let officeLocation = getValueFromArrayOfObject(offices, "code", 
                        data.result[index].office, "description");
                    claimDetails.office = officeLocation;
                });
                
                cy.getBusinessDivisions(token, agreementType).then((divisions) => {
                    let division = getValueFromArrayOfObject(divisions, "code", 
                        busnDivision, "description");
                    claimDetails.division = division;
                });

                cy.getBusinessClasses(token, agreementType).then((classes) => {
                    let busClass = getValueFromArrayOfObject(classes, "code", 
                        busnClass, "description");
                    claimDetails.businessClass = busClass;
                });       
                
                claimDetails.eventDesc = description;
                claimDetails.rolePerson = source.name;
                claimDetails.originalInsured = originalInsured.name;
                let coverage = data.result[index].coverageInformation;
                cy.getInterests(token, coverage.agreementId).then(interests => {
                    claimDetails.interest = getValueFromInterestList(interests, interest);
                    console.log(claimDetails);
                });
            });
        });
    });

    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Claim Handling");
        mainNav.goTo("Claims");
        searchForm.clickResetButton();
        cy.clickLink("Advanced search");
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it('Claims Advanced Search - Office', () => {
        searchForm.selectValue("Office", claimDetails.office);
        searchForm.clickSearchButton();
        resultTable.verifyResultsReturned();
    });

    it('Claims Advanced Search - Division', () => {
        searchForm.selectValue("Division", claimDetails.division);
        searchForm.clickSearchButton();
        resultTable.verifyResultsReturned();
    });

    it('Claims Advanced Search - Business class', () => {
        searchForm.selectValue("Business class", claimDetails.businessClass);
        searchForm.clickSearchButton();
        resultTable.verifyResultsReturned();
    });

    it('Claims Advanced Search - Interest', () => {
        searchForm.selectValue("Interest", claimDetails.interest);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Interest", claimDetails.interest);
    });

    it('Claims Advanced Search - Event', () => {
        searchForm.selectValue("Event", claimDetails.eventDesc);
        searchForm.clickSearchButton();
        resultTable.verifyResultsReturned();
    });

    // Deprecated  
    /*it('Claims Advanced Search - Role Type', () => {
        searchForm.selectValue("Role Type", "Claims adjuster")
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Role Type", "Claims adjuster");
        searchForm.clickResetButton();
        cy.clickLink("Advanced search")
        cy.selectValue("Role Type", "CEFOR id")
        searchForm.clickSearchButton();
        searchForm.clickResetButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Role Type", "CEFOR id");
    });

    // Deprecated
    it('Claims Advanced Search - Role Person', () => {
        searchForm.selectValue("Role Person", claimDetails.rolePerson)
        searchForm.clickSearchButton();
        resultTable.verifyResultsReturned();
    });

    // Deprecated
    it('Claims Advanced Search - Role Reference', () => {
        searchForm.inputValue("Role Reference", "Test")
        searchForm.clickSearchButton();
        resultTable.verifyResultsReturned();
    });

    // Deprecated
    it('Claims Advanced Search - Role Note', () => {
        searchForm.inputValue("Role Note", "Test")
        searchForm.clickSearchButton();
        resultTable.verifyResultsReturned();
    }); */
});