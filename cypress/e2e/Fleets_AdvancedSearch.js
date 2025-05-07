/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { DialogElements } from "../pages/DialogElements";
import { SearchForm } from "../pages/SearchForm";
import { ObjectsPage } from "../pages/ObjectsPage";
import { substringToLastIndex } from "../support/utils";

// Environment
const { portal, api, envValue } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const dialog = new DialogElements();
const searchForm = new SearchForm();
const objectsPage = new ObjectsPage();

let objectDetails = {
    "Name": "",
    "IMO Number": "",
    "Vessel Type": "Supply",
    "Object Type": "",
    // "Manager": "",
    "Manager Id": "4568",
    "Manager Name": "Noria Software Sandefjord",
    "SSN": "08090000000",
    "Org.no": "971274255"
}

describe(`Broker - Fleets Advanced Search`, () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            cy.getObjectDetailsSortedByIMO(envValue, token);
            cy.fixture(`${envValue}-objectDetailsSortedByIMO`).then((data) => {
                for (let index = 0; index < data.result.length; index++) {
                    let { version, manager, fleetMarine } = data.result[index];
                    console.log(`Index=${index} - Version:${version}, Manager:${manager}, FleetMarine:${fleetMarine}`);
                    if (version === 1 && manager !== null && fleetMarine !== null) {
                        const { name, imoNumber, type } = data.result[index];
                        objectDetails["Name"] = name;
                        objectDetails["IMO Number"] = imoNumber.toString();
                        // Some Manager ID is unable to be searched
                        // objectDetails["Manager Name"] = manager["name"];
                        // objectDetails["Manager Id"] = manager["id"].toString();
                        objectDetails["Object Type"] = substringToLastIndex(type, 0, "_");
                        return false;
                    }
                }
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

    it(`Broker - Fleets Advanced Search - Search for Name and Validate`, () => {
        searchForm.clickMagnifierIcon("Connected Object");
        dialog.removeAllSearchCriteria();
        dialog.inputValue("Name", objectDetails["Name"]);
        dialog.verifySearchCriteria("Name", objectDetails["Name"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Object Name", objectDetails["Name"]);
    });

    it(`Broker - Fleets Advanced Search - Search for IMO Number and Validate`, () => {
        searchForm.clickMagnifierIcon("Connected Object");
        dialog.removeAllSearchCriteria();
        dialog.inputValue("IMO Number", objectDetails["IMO Number"]);
        dialog.verifySearchCriteria("IMO Number", objectDetails["IMO Number"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("IMO Number", objectDetails["IMO Number"]);
    });

    it(`Broker - Fleets Advanced Search - Search for Vessel Type and Validate`, () => {
        searchForm.clickMagnifierIcon("Connected Object");
        dialog.removeAllSearchCriteria();
        dialog.selectValue("Vessel Type", objectDetails["Vessel Type"]);
        dialog.verifySearchCriteria("Vessel Type", objectDetails["Vessel Type"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Vessel Type", objectDetails["Vessel Type"]);
    });

    it(`Broker - Fleets Advanced Search - Search for Manager and Validate`, () => {
        searchForm.clickMagnifierIcon("Connected Object");
        dialog.removeAllSearchCriteria();
        dialog.selectValue("Manager", objectDetails["Manager Name"]);
        dialog.verifySearchCriteria("Manager", objectDetails["Manager Name"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Manager", objectDetails["Manager Name"]);
    });

    it(`Broker - Fleets Advanced Search - Search for Object Type and Validate`, () => {
        searchForm.clickMagnifierIcon("Connected Object");
        dialog.removeAllSearchCriteria();
        dialog.selectValue("Object Type", objectDetails["Object Type"]);
        dialog.verifySearchCriteria("Object Type", objectDetails["Object Type"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Object Type", objectDetails["Object Type"]);
    });

    it(`Broker - Fleets Advanced Search - Search for Manager Id and Validate`, () => {
        searchForm.clickMagnifierIcon("Manager");
        dialog.clickButton("Reset");
        dialog.inputValue("Id", objectDetails["Manager Id"]);
        dialog.verifySearchCriteria("Id", objectDetails["Manager Id"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Id", objectDetails["Manager Id"]);
    });

    it(`Broker - Fleets Advanced Search - Search for Manager Name and Validate`, () => {
        searchForm.clickMagnifierIcon("Manager");
        dialog.clickButton("Reset");
        dialog.inputValue("Name", objectDetails["Manager Name"]);
        dialog.verifySearchCriteria("Name", objectDetails["Manager Name"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Name", objectDetails["Manager Name"]);
    });

    it(`Broker - Fleets Advanced Search - Search for SSN and Validate`, () => {
        searchForm.clickMagnifierIcon("Manager");
        dialog.clickButton("Reset");
        dialog.inputValue("SSN", objectDetails["SSN"]);
        dialog.verifySearchCriteria("SSN", objectDetails["SSN"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("SSN", objectDetails["SSN"]);
    });

    it(`Broker - Fleets Advanced Search - Search for Org.no and Validate`, () => {
        searchForm.clickMagnifierIcon("Manager");
        dialog.clickButton("Reset");
        dialog.inputValue("Org.no", objectDetails["Org.no"]);
        dialog.verifySearchCriteria("Org.no", objectDetails["Org.no"]);
        dialog.clickButton("Search");
        dialog.verifyAllRowsBasedOnColumHeader("Org.no", objectDetails["Org.no"]);
    });

});