/// <reference types="Cypress" />
/// <reference types="../../support" />
import { AppLauncher } from "../pages/AppLauncher";
import { MainNavigation } from "../pages/MainNavigation";
import { MessagePage } from "../pages/MessagePage";

// Environment
const { portal } = Cypress.env();

// Page Objects
const appLauncher = new AppLauncher();
const mainNav = new MainNavigation();
const message = new MessagePage();

let searchCriteria = {
    "Subject": "Automatic message",
    "Legal Person": "Oslo Forsikring Test"
}

describe("Message Search", () => {
    beforeEach(() => {
        cy.logIntoPortalWithSession(portal.username, portal.password);
        appLauncher.navigateToApp("Self Service");
        mainNav.goTo("Messages");
        cy.waitForPageLoaded();
        message.waitForMessage();
    });

    after(() => {
        cy.logOutFromPortal();
    });

    it(`Message Search - Search by Subject and Legal Person`, () => {
        message.searchMessageBy("Subject", searchCriteria["Subject"]);
        message.verifySearchResult(searchCriteria["Subject"]);
        message.searchMessageBy("Legal Person", searchCriteria["Legal Person"]);
        message.verifySearchResult(searchCriteria["Legal Person"]);
    });

});