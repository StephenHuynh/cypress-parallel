export class TaskPage {

    headerSelector = "#main-content header > ul a span";
    activityBoardSelector = "nv-kanban-board";
    statusColumn = "nv-kanban-column";
    itemSelector = "div[class='card-list-body'] > nv-kanban-card";
    itemHeader = "section[class^='header'] span";
    itemDesc = "section[class^='header'] bo-content-transformer";
    itemAttachmentIcon = "section[class^='header'] div[class^='attachment'] > i";
    dueDate = "section[class^='footer'] span[title] > span";
    created = "section[class^='footer'] div[title='Created'] div[title]";

    clickTaskInColumn(statusColumn = "Todo",  nthItem = 1) {
        let index = 0;
        let indexItem = nthItem - 1;
        cy.get(this.activityBoardSelector).should("be.visible").within(() => {
            if (statusColumn.toLowerCase().replace(" ", "") == "inprogress"){
                index = 1;
            }
            if(statusColumn.toLowerCase().replace(" ", "") == "done"){
                index = 2;
            }
            if(statusColumn.toLowerCase().replace(" ", "") == "cancelled"){
                index = 3;
            }
            cy.get(this.statusColumn).eq(index).within(() => {
                cy.get(this.itemSelector).eq(indexItem).click();
                cy.wait(1000);
            });
        });
    }

    verifyAttachmentIconOfTask(statusColumn = "Todo", nthItem = 1) {
        let index = 0;
        let indexItem = nthItem - 1;
        cy.get(this.activityBoardSelector).should("be.visible").within(() => {
            if (statusColumn.toLowerCase().replace(" ", "") == "inprogress"){
                index = 1;
            }
            if(statusColumn.toLowerCase().replace(" ", "") == "done"){
                index = 2;
            }
            if(statusColumn.toLowerCase().replace(" ", "") == "cancelled"){
                index = 3;
            }
            cy.get(this.statusColumn).eq(index).within(() => {
                cy.get(this.itemSelector).eq(indexItem).within(() => {
                    cy.get(this.itemAttachmentIcon).invoke("attr", "class").then(
                        attr => expect(attr).contain("paperclip", "Attachment is expected !"));
                });
            });
        });
    }

    verifyTitleOfTask(statusColumn = "Todo", nthItem = 1, expectedTitle) {
        let index = 0;
        let indexItem = nthItem - 1;
        cy.get(this.activityBoardSelector).should("be.visible").within(() => {
            if (statusColumn.toLowerCase().replace(" ", "") == "inprogress"){
                index = 1;
            }
            if(statusColumn.toLowerCase().replace(" ", "") == "done"){
                index = 2;
            }
            if(statusColumn.toLowerCase().replace(" ", "") == "cancelled"){
                index = 3;
            }
            cy.get(this.statusColumn).eq(index).within(() => {
                cy.get(this.itemSelector).eq(indexItem).within(() => {
                    cy.get(this.itemHeader).first().invoke("text").then(
                        title => expect(title).equal(expectedTitle, "Title is expected !"));
                });
            });
        });
    }

    verifyDescriptionOfTask(statusColumn = "Todo", nthItem = 1, expectedDesc) {
        let index = 0;
        let indexItem = nthItem - 1;
        cy.get(this.activityBoardSelector).should("be.visible").within(() => {
            if (statusColumn.toLowerCase().replace(" ", "") == "inprogress"){
                index = 1;
            }
            if(statusColumn.toLowerCase().replace(" ", "") == "done"){
                index = 2;
            }
            if(statusColumn.toLowerCase().replace(" ", "") == "cancelled"){
                index = 3;
            }
            cy.get(this.statusColumn).eq(index).within(() => {
                cy.get(this.itemSelector).eq(indexItem).within(() => {
                    cy.get(this.itemDesc).invoke("text").then(
                        desc => expect(desc.trim()).equal(expectedDesc, "Description is expected !"));
                });
            });
        });
    }

    verifyDueDateOfTask(statusColumn = "Todo", nthItem = 1, expectedDueDate) {
        let index = 0;
        let indexItem = nthItem - 1;
        cy.get(this.activityBoardSelector).should("be.visible").within(() => {
            if (statusColumn.toLowerCase().replace(" ", "") == "inprogress"){
                index = 1;
            }
            if(statusColumn.toLowerCase().replace(" ", "") == "done"){
                index = 2;
            }
            if(statusColumn.toLowerCase().replace(" ", "") == "cancelled"){
                index = 3;
            }
            cy.get(this.statusColumn).eq(index).within(() => {
                cy.get(this.itemSelector).eq(indexItem).within(() => {
                    cy.get(this.dueDate).invoke("text").then(
                        due => expect(due).equal(expectedDueDate, "Due Date is expected !"));
                });
            });
        });
    }

    verifyCreatedUserOfTask(statusColumn = "Todo", nthItem = 1, expectedCreatedUser) {
        let index = 0;
        let indexItem = nthItem - 1;
        cy.get(this.activityBoardSelector).should("be.visible").within(() => {
            if (statusColumn.toLowerCase().replace(" ", "") == "inprogress"){
                index = 1;
            }
            if(statusColumn.toLowerCase().replace(" ", "") == "done"){
                index = 2;
            }
            if(statusColumn.toLowerCase().replace(" ", "") == "cancelled"){
                index = 3;
            }
            cy.get(this.statusColumn).eq(index).within(() => {
                cy.get(this.itemSelector).eq(indexItem).within(() => {
                    cy.get(this.created).invoke("attr", "title").then(
                        user => expect(user).equal(expectedCreatedUser, "Created User is expected !"));
                });
            });
        });
    }
}
