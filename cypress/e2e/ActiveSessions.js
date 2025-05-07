/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { ResultTable } from "../pages/ResultTable";
import { MainNavigation } from "../pages/MainNavigation";
import { getCurrentDateFormatted , getCurrentTime } from "../support/utils";

// Environment
const { portal , envValue, api } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const resultTable = new ResultTable();

// Variables
let username = "";
let currentDateTime = "";

describe("Administration - Users - Active Sessions", () => {
    before(() => {
        cy.loginAPI(api.authEndpoint, api.token).then((token) => {
            cy.getSignatureDetails(envValue,token,portal.signature);
            cy.fixture(`${envValue}-${portal.signature}Details`).then((details) => {
                username = details.name;
            });
        });
    });
    
    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        currentDateTime = getCurrentDateFormatted("DD/MM/YYYY").concat(" ",getCurrentTime());
        appLauncher.navigateToApp("Administration");
        mainNav.goTo("Users");
        mainNav.goTo("Active Sessions");
    });

    it("Validate if the current session shows up in the result table", () => {
        resultTable.verifyRowBasedOnColumHeaderAndRow("User", username,"Method", "Password");
        resultTable.verifyRowBasedOnColumHeaderAndRow("User", username,"Date", currentDateTime);
    });
    
})