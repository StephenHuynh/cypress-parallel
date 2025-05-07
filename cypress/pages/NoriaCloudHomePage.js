export class NoriaCloudHomePage {
    myAppsSectionSelector = "div[class='left-widget-wrapper']";
    moreLinkSelector = "[class='fa fa-arrow-right']"; // the link below the draggable list

    clickOnAppButton(title) {
        cy.get(this.myAppsSectionSelector).within(() => {
            cy.get(`a[title="${title}"]`).click();
        })        
    }
}