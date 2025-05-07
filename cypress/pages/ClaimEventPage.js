/*
    Page Object for Create Claim Event
*/
import { CommonElements } from "./CommonElements";
const commonElements = new CommonElements();

export class ClaimEventPage {

    agreementTypeSelector = "d-select[name='claimEventForm.AgreementType']";
    eventDropDownSelector = "d-select[name='claimEventForm.SuperEvent']";
    eventDetailDropDownSelector = "d-select[name='claimEventForm.MainEvent']";
    areaCodeDropDownSelector = "div[class*='area-code-dropdown-control']";

    eventDateSelector = "input[id='claimEventForm.EventDate']";
    descriptionSelector = "textarea[id='claimEventForm.Description']";

    dropDownMenuSelector = "div[class='selectize-dropdown-content']";
    dropDownOptionSelector = "div[class='selectize-dropdown-content'] > div[class^='option']";

    inputEventDate(date) {
        cy.get(this.eventDateSelector).type(date);
    }

    inputDescription(text) {
        cy.get(this.descriptionSelector).type(text);
    }

    selectValueFrom(label, option) {
        let selector = ""
        switch (label.toLowerCase()) {
            case "agreement type":
            case "agreement":
            case "type":
                selector = this.agreementTypeSelector;
                break;
            case "event":
            case "super event":
                selector = this.eventDropDownSelector;
                break;
            case "event detail":
            case "main event":
                selector = this.eventDetailDropDownSelector;
                break;
            default:
                break;
        }
        cy.get(`${selector}:visible`).click();
        cy.wait(1000);
        if (typeof (option) === "undefined") {
            cy.get(`${this.dropDownOptionSelector}:visible`).first().click({force: true});
        } else {
            cy.get(`${this.dropDownOptionSelector}:visible`).contains(option).click();
        }
        cy.waitForPageLoaded();
    }

    selectAreaCode(option) {
        cy.get(this.areaCodeDropDownSelector).click();
        cy.wait(800);
        if (typeof (option) === "undefined") {
            cy.get(`${commonElements.nvDropdownPanel_options}:visible`).first().click();
        } else {
            cy.get(`${commonElements.nvDropdownPanel_options}:visible`).contains(option).click();
        }
    }

    verifyNewsStatus(text) {
        cy.get(this.statusSelector).should("contain", text);
    }
}
