/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { SearchForm } from "../pages/SearchForm";
import { ResultTable } from "../pages/ResultTable";
import { substringToLastIndex } from "../support/utils";

// Environment
const { portal, api, envValue } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const searchForm = new SearchForm();
const resultTable = new ResultTable();

let inputVars = {
    "Name": "",
    "IMO Number": "",
    "Object Number": "",
}

let selectVars = {
    "Manager": "",
    "Owner": "",
    "Fleet": ""
}

var vesselTypeDataValue = "";
var objectType = "";

describe("PA-15802 - Broker - Object Search", () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            cy.getObjectDetails(envValue, token, "Dummy Vessel");
            cy.fixture(`${envValue}-objectDetails`).then((data) => {
                for (let index = 0; index < data.result.length; index++) {
                    let { version, manager, fleetMarine } = data.result[index];
                    console.log(`Index=${index} - Version:${version}, Manager:${manager}, FleetMarine:${fleetMarine}`);
                    if (version === 1 && manager !== null && fleetMarine !== null) {
                        const { objectNumber, name, imoNumber, owner, type, vesselType } = data.result[index];
                        inputVars["Name"] = name;
                        inputVars["Object Number"] = objectNumber.toString();
                        inputVars["IMO Number"] = imoNumber.toString();
                        selectVars["Manager"] = manager["name"];
                        selectVars["Owner"] = owner["name"];
                        vesselTypeDataValue = vesselType;
                        objectType = substringToLastIndex(type, 0, "_");
                        cy.getFleetDetailsById(envValue, token, fleetMarine);
                        cy.fixture(`${envValue}-${fleetMarine}Detail`).then((data) => {
                            selectVars["Fleet"] = data.name;
                            console.log("Fleet:", selectVars["Fleet"]);
                        });
                        return false;
                    }
                }
            });

        });
    });

    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Broker");
        mainNav.goTo("Objects");
        searchForm.clickResetButton();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    Object.keys(inputVars).forEach(key => {
        it(`Broker - Object Search - Search for ${key}`, () => {
            searchForm.inputValue(key, inputVars[key]);
            if (key !== 'IMO Number') {
                searchForm.verifySearchCriteria(key, inputVars[key]);
            }
            searchForm.removeSearchCriteria(key);
            searchForm.inputValue(key, inputVars[key]);
            searchForm.clickSearchButton();
            if (key === 'Object Number') {
                resultTable.verifyAllRowsBasedOnColumHeader("Id", inputVars[key]);
            }
            if (key === 'Name' || key === 'IMO Number') {
                resultTable.verifyAllRowsBasedOnColumHeader(key, inputVars[key]);
            }
            resultTable.verifyResultsReturned();
        });
    });

    Object.keys(selectVars).forEach(key => {
        it(`Broker - Object Search - Search for ${key}`, () => {
            searchForm.selectValue(key, selectVars[key]);
            searchForm.verifySearchCriteria(key, selectVars[key]);
            searchForm.removeSearchCriteria(key);
            searchForm.selectValue(key, selectVars[key]);
            searchForm.clickSearchButton();
            if (key === 'Manager') {
                resultTable.verifyAllRowsBasedOnColumHeader(key, selectVars[key]);
            }
            resultTable.verifyResultsReturned();
        });
    });

    it(`Broker - Object Search - Search for Vessel Type`, () => {
        searchForm.selectVesselTypeByDataValue(vesselTypeDataValue);
        searchForm.removeSearchCriteria("Vessel Type");
        searchForm.selectVesselTypeByDataValue(vesselTypeDataValue);
        searchForm.clickSearchButton();
        cy.getSearchCriteriaValue("Vessel Type").then((type) => {
            resultTable.verifyAllRowsBasedOnColumHeader("Vessel Type", type);
        });
    });

    it(`Broker - Object Search - Search for Object Type`, () => {
        searchForm.selectValue("Object Type", objectType);
        searchForm.verifySearchCriteria("Object Type", objectType);
        searchForm.clickSearchButton();
        resultTable.verifyAllRowsBasedOnColumHeader("Object Type", objectType);
    });
});