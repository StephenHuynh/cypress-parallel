export class NewsPage {
    
    statusSelector = "bo-self-service-news-status > label";
    readTimeSelector = "input[id='newsForm.Readtime']"

    verifyNewsStatus(text) {
        cy.get(this.statusSelector).should("be.visible").and("contain", text);
    }

    enterTextForCKEditor(txt) {
        cy.get(this.readTimeSelector).realPress("Tab");
        cy.realPress("Tab");
        cy.wait(200);
        cy.realType(txt);
        cy.realPress("Tab")
    }
}
