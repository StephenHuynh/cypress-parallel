export class MainNavigation {
    
    mainNavigationSelector = "ul[class^='main-nav']";
    sideMenuSelector = "div[class*='side-menu-toggle'] button";
    sideBarSelector = "#sidebar";
    /*
        Go to main navigation based on name 
    */
    goTo(mainNav){
        cy.get(this.mainNavigationSelector).as("mainNav");
        cy.get("@mainNav").find("li a span").contains(mainNav).parents("a").click({force: true});
        cy.wait(2000);
        cy.waitForPageLoaded();
    }

    sideMenu(){
        cy.log("Minimize the Side Bar!");
        cy.get(this.sideBarSelector).realHover("mouse");
        cy.get(this.sideMenuSelector).click().wait(500);
    }

}
