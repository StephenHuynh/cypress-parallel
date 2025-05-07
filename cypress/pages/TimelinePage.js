import { DialogElements } from "./DialogElements";
import { CommonElements } from "./CommonElements";
import { getValueFromArrayOfObject } from "../support/utils";

const dialog = new DialogElements();
const commonElements = new CommonElements();

export class TimelinePage {
    // timelineViewPortSelector = "bo-paris-timeline";
    timelineItemSelector = "nv-timeline-entry";
    dateSelector = "nv-timeline-group-title";
    dateTitleSelector = "span[class='timeline-default-time']";
    timelineEntrySelector = "nv-timeline-entry-header";
    timelineEntryContentSelector = "bo-content-transformer";
    checkboxSelector = "input[type='checkbox']";

    /* Claims - Timeline */
    claimsTimeline_mainContainer = "bo-paris-system-event-timeline";
    claimsTimeline_leftContainer = "bo-paris-system-event-interaction";
    claimsTimeline_rightContainer = "article[class*='timeline-area']";
    claimsTimeline_leftContainer_header = "header > h3";
    claimsTimeline_leftContainer_checkboxLabel = "label";
    claimsTimeline_rightContainer_searchTxt = "div[class='timeline-top'] input[type='text']";
    claimsTimeline_rightContainer_timeLineGroup = "div[class='timeline-area'] nv-timeline-group";
    claimsTimeline_rightContainer_timeLineGroup_title = "nv-timeline-group-title";
    claimsTimeline_rightContainer_timeLineGroup_title_date = "span[class='timeline-default-time']";
    claimsTimeline_rightContainer_timeLineGroup_entry = "nv-timeline-entry";
    claimsTimeline_rightContainer_timeLineGroup_entry_left = "nv-timeline-entry-side";
    claimsTimeline_rightContainer_timeLineGroup_entry_left_time = "span[class^='timeline-default-time']";
    claimsTimeline_rightContainer_timeLineGroup_entry_left_spinner = "i[class$='fa-spinner']";
    claimsTimeline_rightContainer_timeLineGroup_entry_left_icon = "span[class^='timeline-default-icon'] i";
    claimsTimeline_rightContainer_timeLineGroup_entry_right = "div[class^='nv-timeline-entry-item']";
    claimsTimeline_rightContainer_timeLineGroup_entry_right_text = "nv-text-truncate";
    claimsTimeline_rightContainer_timeLineGroup_entry_right_user = "bo-user-profile-link a";
    claimsTimeline_rightContainer_timeLineGroup_entry_right_status = "bo-system-event-footer-compact bo-activity-status label span[title]";
    claimsTimeline_rightContainer_timeLineGroup_entry_right_share = "bo-system-event-footer-compact nv-button button[title='Sharing with customer']";
    claimsTimeline_rightContainer_timeLineGroup_entry_right_view = "bo-system-event-footer-compact nv-button button i[class*='fa-eye']";
    claimsTimeline_rightContainer_timeLineGroup_entry_right_download = "bo-system-event-footer-compact nv-button button i[class*='fa-download']";

    iconValues = [
        { type: "Claim", iconValue: "fa-file-alt" },
        { type: "Attachment", iconValue: "fa-archive" },
        { type: "Task", iconValue: "fa-calendar-check" },
        { type: "Claim", iconValue: "fa fa" },
    ]

    waitForTimelineLoaded(counter = 0) {
        cy.get(this.dateSelector).first().then((element) => {
            cy.wrap(element).find(this.dateTitleSelector).invoke("text").then((text) => {
                console.log(text)
                if (text.includes("Loading") && counter < 30) {
                    counter = counter + 1;
                    cy.wait(3000);
                    this.waitForTimelineLoaded(counter)
                }
            })
        });
    }

    verifyNoteContentInFirstEntryOnTimeline(note) {
        cy.get(this.timelineEntrySelector).first().then((element) => {
            cy.wrap(element).find(this.timelineEntryContentSelector).invoke("text").should("contain", note);
        });
    }

    clickOnFirstItemOnTimeline() {
        cy.get(this.timelineEntrySelector).first().click();
    }

    clickOnCheckBoxWithText(text) {
        cy.get(this.checkboxSelector).parent().find("label").contains(text).click();
        this.waitForTimelineLoaded();
    }

    getLink(value) {
        return cy.get(`${this.claimsTimeline_leftContainer} ${commonElements.nvButton}`)
            .contains(value, { matchCase: false });
    }

    getSearchField() {
        return cy.get(`${this.claimsTimeline_rightContainer} ${this.claimsTimeline_rightContainer_searchTxt}`);
    }

    getCheckbox(value) {
        return cy.get(`${this.claimsTimeline_leftContainer} ${this.claimsTimeline_leftContainer_checkboxLabel}`)
            .contains(value, { matchCase: false });
    }

    verifyTimelineEntry(dateValue, timeValue, type, container, user) {
        const iconValue = getValueFromArrayOfObject(this.iconValues, "type", type, "iconValue");
        cy.get(`${this.claimsTimeline_rightContainer_timeLineGroup}[class^='ng-star']`)
            .within((rightContainer) => {
                // Verify Date
                cy.wrap(rightContainer).find(this.claimsTimeline_rightContainer_timeLineGroup_title)
                    .within(groupElement => {
                        if (dateValue === undefined || dateValue === "") {
                            cy.wrap(groupElement)
                                .find(this.claimsTimeline_rightContainer_timeLineGroup_title_date)
                                .invoke("text").should("not.be.null");
                        } else {
                            cy.wrap(groupElement)
                                .find(this.claimsTimeline_rightContainer_timeLineGroup_title_date)
                                .invoke("text").then(
                                    actual => assert.isTrue(actual.toLowerCase().trim() === dateValue.toLowerCase(),
                                        `Actual Value: ${actual} is not equal to Expected Value: ${dateValue}`));
                        }
                    });

                // Verify Time
                cy.wrap(rightContainer).find(this.claimsTimeline_rightContainer_timeLineGroup_entry)
                    .within(groupElement => {
                        if (timeValue === undefined || timeValue === "") {
                            cy.wrap(groupElement)
                                .find(this.claimsTimeline_rightContainer_timeLineGroup_entry_left_time)
                                .invoke("text").should("not.be.null");
                        } else {
                            cy.wrap(groupElement)
                                .find(this.claimsTimeline_rightContainer_timeLineGroup_entry_left_time)
                                .invoke("text").then(
                                    actual => assert.isTrue(actual.toLowerCase().trim().includes(timeValue.toLowerCase()),
                                        `Actual Value: ${actual} is not equal to Expected Value: ${timeValue}`));
                        }
                    });

                // Verify Type and Icon
                cy.wrap(rightContainer).find(this.claimsTimeline_rightContainer_timeLineGroup_entry)
                    .within(groupElement => {
                        cy.wrap(groupElement)
                            .find(this.claimsTimeline_rightContainer_timeLineGroup_entry_left_icon)
                            .invoke("attr", "class").should("contain", iconValue);
                    });
            });
    }

    waitForTimelineSearchCompleted(counter = 0) {
        cy.wait(500);
        cy.get(this.dateSelector).first().then((element) => {
            cy.wrap(element).find(this.dateTitleSelector).invoke("text").then((text) => {
                console.log(text)
                if (text.includes("Loading") && counter < 30) {
                    counter = counter + 1;
                    cy.wait(1000);
                    this.waitForTimelineSearchCompleted(counter);
                }
            });
        });
    }
}