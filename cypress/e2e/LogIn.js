/// <reference types="Cypress" />
/// <reference types="../../support" />
import LoginPage from "../pages/LoginPage";

// Environment
const { portal } = Cypress.env();

// Page Objects
const loginPage = new LoginPage();

describe("Login", () => {
    it("PA-15571 - Login and LogOut successfully", { tags: ['smoke'] }, () => {
        cy.logIntoPortal(portal.username, portal.password);
        cy.url().should("contain", "dashboard");
        cy.logOutFromPortal();
    });

    it("Login unsuccessfully with empty password", { tags: ['smoke'] }, () => {
        cy.visit(portal.url);
        loginPage.getUsername().type(portal.username);
        loginPage.getLoginButton().should("be.disabled");
    });

    it("Login unsuccessfully with incorrect Username and Password", () => {
        cy.visit(portal.url);
        loginPage.getUsername().type("Abcd");
        loginPage.getPassword().type("XYZ");
        loginPage.getLoginButton().click();
        loginPage.getErrorMessage().contains("Incorrect username or password");
    });

    it("Login unsuccessfully without Username and Password", () => {
        cy.visit(portal.url);
        loginPage.getLoginButton().should("be.disabled");
    });
    
});