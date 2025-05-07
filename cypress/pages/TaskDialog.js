export class TaskDialog {
    dialogViewPortSelector = "section[class^='dialog view-port']";

    // Task list in dialog
    taskListViewSelector = "activity-list-view";
    taskItemSelector = "easy-list-view-item";
    viewButtonSelector = "button[title='View']";
    taskTitleSelector = "span[class='title']";
    taskNoteSelector = "bo-content-transformer";
    changeStatusButtonSelector = "button[title^='Mark as']";
    statusSelector = "bo-activity-status > label";

    verifyNewlyCreatedTask(title = "", note = "") {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            cy.get(this.taskListViewSelector).within(() => {
                cy.get(this.taskItemSelector).first().within((item) => {
                    cy.wrap(item).as("taskItem");
                    if (title != "")
                        cy.get("@taskItem").find(this.taskTitleSelector).invoke("text").then((text) => {
                            expect(text).to.contain(title);
                        });
                    if (note != "")
                        cy.get("@taskItem").find(this.taskNoteSelector).invoke("text").then((text) => {
                            expect(text).to.contain(note);
                        });
                }); 
            });
        });
    }

    viewSpecificItem(by, text) {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            cy.get(this.taskListViewSelector).within(() => {
                cy.get(this.taskItemSelector)
                    .find(by === "title" ? this.taskTitleSelector : this.taskNoteSelector)
                    .contains(text)
                    .parentsUntil(this.taskItemSelector).then((item) => {
                        cy.wrap(item).find(this.viewButtonSelector).click();
                    });
            });
        });
        cy.waitForPageLoaded();
    }

    verifyTaskStatus(status, text) {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            cy.get(this.taskListViewSelector).within(() => {
                cy.get(this.taskItemSelector)
                    .find(this.taskTitleSelector)
                    .contains(text)
                    .parentsUntil(this.taskItemSelector).then((item) => {
                        cy.get(item).find(this.statusSelector).then((taskStatus) => {
                            expect(taskStatus).to.contain(status);
                        });
                    });
            });
        });
    }

    changeStatusOfSpecificItem(text) {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            cy.get(this.taskListViewSelector).within(() => {
                cy.get(this.taskItemSelector)
                    .find(this.taskTitleSelector)
                    .contains(text)
                    .parentsUntil(this.taskItemSelector).then((item) => {
                        cy.wrap(item).find(`${this.changeStatusButtonSelector}:visible`).click();
                    });
            });
        });
        cy.confirmDialog();
        cy.waitForPageLoaded();
    }
}