import { Header } from "./Header";

const header = new Header();

export class AppLauncher {
    
    applicationMenuSelector = ".drawer-menu-content";
    
    /*
        Open App Launcher and go to specific app 
    */
    navigateToApp(appName){
        cy.intercept('GET', '**/user/current').as('getUser');
        cy.visit("/backoffice");
        cy.window().should('have.property', 'App');
        cy.wait(1000);
        cy.pageLoading(50);
        cy.wait('@getUser').its('response.statusCode').should('eq', 200);
        cy.waitForPageLoaded();
        header.getAppLauncher().click();
        cy.wait(500);
        cy.get(this.applicationMenuSelector).as("menu");
        cy.get("@menu").find("span").contains(appName).click({force: true});
        cy.wait(500);
        cy.waitForPageLoaded();
        cy.get(header.moduleHeaderSelector).should("contain.text", appName);
    }

}
