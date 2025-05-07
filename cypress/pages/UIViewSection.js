import { ResultTable } from "../pages/ResultTable";
import { CommonElements } from "../pages/CommonElements";
const resultTable = new ResultTable();
const common = new CommonElements();
/**
 * @description: is used for Legal Person page
 */
export class UIViewSection {

    personNameSector = "div[class^='name'] h3";

    inforSection = {
        selector: "section[class='question-group event-info']",
        // child elements
        headerSection: "header h4",
        subHeader: "h2[class='media-heading']",
        inforHeaderSelector: "ul li > strong",
        inforValueSelector: "ul li > span",
    }

    // CommonElements.js -> Notes / Tasks Tab
    noteListView = "bo-note-list-view"; 
    taskListView = "bo-activity-list-view";
    easyListViewSection = {
        selector: "article[class^='list-view-item ']",
        // child elements
        icon: "bo-note-icon span[class*='list-item-icon'] i", // for NOTE only
        priorityIcon: "i[class*='task-priority-icon']",
        headerSection: "span[class='title']",
        statusText: "bo-activity-status label",
        historyValue: "span > i[class*='fa-history']",
        // createdSection: "span[title^='Created']",
        bodySection: "nv-text-truncate span[class='nv-text-truncate-content']",
        // dueDate: "section[class^='footer'] span[ng-attr-title*='momentDateTime'] > span",
        dueDate: "section[class^='footer'] > span > i[class*='calendar']",
        userProfile: "bo-user-profile-link a",
        group: "span[title='Group'] > nv-system-codes",
        viewButton: "section[class^='footer'] button[title='View']"

    }

    AddBtn = "button[type='button']";
    // Address section
    addressSection = "person-address";
    addressTable = "table[id='paris-search-person-address']";

    // Responsible section
    responsibleSection = "bo-person-responsible-list";
    responsibleTable = "table[id='person-responsible-list']";

    // Role section
    roleSection = "bo-person-roles";
    roleTable = "bo-person-roles table";

    spinner = "i[class='fa fa-spinner fa-spin']";
    cViewTabs = "div[data-d-tab='$ctrl.tabs']";

    profileSection = "#account-detail-container";

    waitForUIViewReady() {
        cy.get(`${common.nvTabs}:visible`).then($tab => {
            if ($tab.find(`${this.spinner}:visible`).length) {
                cy.log("Waiting for UIView to be ready!");
                cy.wait(1000);
                this.waitForUIViewReady();
            }
        });
    }

    waitForFirstTabEnabled() {
        cy.get(`${this.cViewTabs}:visible`).then($tab => {
            if ($tab.find('li a').first().hasClass("disabled")) {
                cy.log("Waiting for 1st Tab available!");
                cy.wait(1000);
                this.waitForFirstTabEnabled();
            }
        });
    }

    verifyLegalPersonHeaderName(name) {
        cy.get(`${common.mainContainer}:visible`).then($uiView => {
            const header = $uiView.find(`${this.personNameSector}`).text().toUpperCase();
            expect(header).be.contains(name.toUpperCase());
        })
    }

    verifyBusinessCardInformation(header, value) {
        cy.get(this.inforSection.headerSection).then((sectionHeaderElement) => {
            for (let sec = 0; sec < sectionHeaderElement.length; sec++) {
                const sectionHeader = sectionHeaderElement[sec].textContent.trim();
                if (sectionHeader.includes("Business Card")) {
                    let parentNode = sectionHeaderElement[sec].parentElement;
                    return parentNode.parentElement;
                }
            }
        }).        
        within(() => {
            cy.get(this.inforSection.inforHeaderSelector).then((headerName) => {
                for (let index = 0; index < headerName.length; index++) {
                    const headerText = headerName[index].textContent.trim();
                    console.log(headerText);
                    if (headerText.includes(header)) {
                        let node = headerName[index].nextSibling
                        console.log(node);
                        return node;
                    }
                }
            }).then((element) => {
                cy.wrap(element).invoke("text").then(text => {
                    expect(text.trim().toUpperCase()).to.contain(value.toUpperCase());
                });
            });
        });
    }

    verifyLatestTask(title, desc, user, status = "ToDo", due_date = "None", priority = "None", handler = "None", group = "None") {
        cy.get(`${this.taskListView}:visible`).within(() => {
            cy.get(`${this.easyListViewSection.selector}:visible`).first().then($list => {
                const headerValue = $list.find(`${this.easyListViewSection.headerSection}`)
                                                .text().toUpperCase().trim();
                expect(headerValue).be.equal(title.toUpperCase());
                
                const statusValue = $list.find(`${this.easyListViewSection.statusText}`)
                        .text().toUpperCase().trim();
                expect(statusValue).be.equal(status.toUpperCase());
                
                const createdUserValue = $list.children("div").get(1).firstElementChild
                        .querySelector(this.easyListViewSection.userProfile).textContent.toUpperCase().trim();
                expect(createdUserValue).be.equal(user.toUpperCase());
                
                const createdTimeValue = $list.find(this.easyListViewSection.historyValue)
                        .text().toUpperCase().trim();
                expect(createdTimeValue).be.contain("minutes ago");
                
                const body = $list.find(`${this.easyListViewSection.bodySection}`)
                        .text().toUpperCase().trim();
                expect(body).be.equal(desc.toUpperCase());
                
                if (handler !== "None"){
                    const handlerValue = $list.children("div").get(3).firstElementChild
                        .querySelector(this.easyListViewSection.userProfile).textContent.toUpperCase().trim();
                    expect(handlerValue).be.equal(handler.toUpperCase());
                }
                if (group !== "None"){
                    const groupName = $list.find(`${this.easyListViewSection.group}`)
                                                .text().toUpperCase().trim();
                    expect(groupName).be.contain(group.toUpperCase());
                }
                if (priority !== "None"){
                    const priorityStatus = $list.find(`${this.easyListViewSection.icon}`).attr("class");
                    expect(priorityStatus).be.contain("task-priority-icon");
                }
                if (due_date !== "None"){
                    const dueDate = $list.find(`${this.easyListViewSection.dueDate}`)
                                                    .parent("span").text().trim();
                    expect(dueDate).be.equal(due_date);
                }
                
            });
        });        
    }

    /**
	 * @description Verify Row's Value (Text) (at least 1 row) based on Colum Header in Table
	 * @param {String} colHeader - Column Header
	 * @param {String} sourceValue - Value of Row
	 */
    verifyAddressInTable(columnHeader, searchText) {
        let tableSelector = this.addressTable;
        resultTable.verifyRowBasedOnColumHeader(columnHeader, searchText, tableSelector);
    }

    verifyAddressInTableBasedOnHeaderAndRow(sourceHeader, sourceValue, searchHeader, searchValue) {
        let tableSelector = this.addressTable;
        resultTable.verifyRowBasedOnColumHeaderAndRow(sourceHeader, sourceValue, searchHeader, searchValue, tableSelector);
    }

    verifyResponsibleInTable(columnHeader, searchText) {
        let tableSelector = this.responsibleTable;
        resultTable.verifyRowBasedOnColumHeader(columnHeader, searchText, tableSelector);
    }

    clickAddResponsible(){
        cy.get(this.responsibleSection).scrollIntoView().within(() => {
            cy.get(this.AddBtn).click();
            cy.wait(1000);
        });
    }

    editResponsibleInTable(rowValue){
        let tableSelector = this.responsibleTable;
        resultTable.performSpecificActionInResultTable(rowValue, "Edit", tableSelector);
        cy.wait(1000);
    }

    deleteResponsibleInTable(rowValue){
        let tableSelector = this.responsibleTable;
        resultTable.performSpecificActionInResultTable(rowValue, "Delete", tableSelector);
        cy.wait(1000);
    }

    clickAddRole(){
        cy.get(this.roleSection).scrollIntoView().within(() => {
            cy.get(`${this.AddBtn}:visible`).contains("Add").click();
            cy.wait(1000);
        });
    }

    verifyRoleInTable(columnHeader, searchText) {
        let tableSelector = this.roleTable;
        resultTable.verifyRowBasedOnColumHeader(columnHeader, searchText, tableSelector);
    }

    editRoleInTable(rowValue){
        let tableSelector = this.roleTable;
        resultTable.performSpecificActionInResultTable(rowValue, "Edit", tableSelector);
        cy.wait(1000);
    }

    deleteRoleInTable(rowValue){
        let tableSelector = this.roleTable;
        resultTable.performSpecificActionInResultTable(rowValue, "Delete", tableSelector);
        cy.wait(1000);
    }

    clickTab(label) {
        cy.get(`${common.nvTabItem}:visible`).then($tab => {
            let tabText = $tab.find(`span:visible:contains('${label}')`).get(0);
            cy.wrap(tabText).click().wait(1000);
        });
        cy.waitForPageLoaded();
    }

    scrollToBottomOfProfile(){
        cy.get(this.profileSection).should("be.visible").scrollTo("bottom", { ensureScrollable: false }).wait(10);
    }

    verifyBottomLeftIsPresented(counter = 0) {
        cy.get(common.notificationBottomLeftToaster).then($leftContainer => {
            let notification = $leftContainer.find(common.shownNotificationBottomLeftToaster);
            if (notification.length > 0){
                cy.get(`${common.notificationBottomLeftToaster} ${common.shownNotificationBottomLeftToaster}`).should('be.visible');
                return true;
            } else if(counter < 5) {
                counter = counter + 1;
                cy.log("Waiting for Notification ...");
                cy.wait(1000);                
                this.verifyBottomLeftIsPresented(counter);
            } else {
                throw new Error("There is no notification!");
            }
        });
    }

    verifyNewlyCreatedNotification(title, content, status = "Active", created_date) {
        cy.waitForPageLoaded();
        cy.get(`${this.easyListViewSection.selector}:visible`).first().then($list => {
            const header = $list.find(`${this.easyListViewSection.headerSection}`).text().toUpperCase().trim();
            const created = $list.find(`${this.easyListViewSection.createdSection}`).text().toUpperCase().trim();
            const body = $list.find(`${this.easyListViewSection.bodySection}`).text().toUpperCase().trim();
            const statusValue = $list.find(`${this.easyListViewSection.statusText}`).text().toUpperCase().trim();
            const createdDate = $list.find(`${this.easyListViewSection.createdDate}`).text().toUpperCase().trim();
            expect(header).be.equal(title.toUpperCase());
            expect(created).be.contain("a minute ago by");
            expect(body).be.equal(content.toUpperCase());
            expect(createdDate).be.equal(created_date.toUpperCase());
            expect(statusValue).be.equal(status.toUpperCase());
        });
    }
    
    // verifyNewlyCreatedNote(type, title)
    verifyLatestNote(type, note, user, due_date, handler = "None") {
        cy.get(`${this.noteListView}:visible`).within(() => {
            cy.get(`${this.easyListViewSection.selector}:visible`).first().then($list => {
                const created = $list.find(`${this.easyListViewSection.createdSection}`).text().toUpperCase().trim();
                const body = $list.find(`${this.easyListViewSection.bodySection}`).text().toUpperCase().trim();
                const dueDate = $list.find(`${this.easyListViewSection.dueDate}`).parent("span").text().trim();
                const profile = $list.find(`${this.easyListViewSection.handler}`)
                                                .text().toUpperCase().trim();

                let expectedType = this.returnType(type);
                const iconAttr = $list.find(this.easyListViewSection.icon).attr("class");

                expect(iconAttr).to.contains(expectedType);
                expect(created).be.contains(`ago by ${user}`.toUpperCase());
                expect(body).be.equal(note.toUpperCase());
                expect(dueDate).be.equal(due_date);
                expect(profile).be.equal(handler.toUpperCase());
            });
        });        
    }

    returnType(text) {
        let icons = ["fa-question", "fa-phone", "fa-meetup", "fa-envelope", "fa-sms"]
        let returnValue = "";
        switch (text) {
            case "Other":
                returnValue = icons[0];
                break;
            case "Call":
                returnValue = icons[1];
                break;
            case "Meeting":
                returnValue = icons[2];
                break;
            case "Mail":
                returnValue = icons[3];
                break;
            case "SMS":
                returnValue = icons[4];
                break;
        }
        return returnValue
    }

    viewSpecificItem(text = "", trigger = "Note") {
        let listViewSelector = "";
        if (trigger === "Note") {
            listViewSelector = this.noteListView;
        } else {
            listViewSelector = this. taskListView;
        }
        // cy.intercept("**GetAllAttachments*NOTE_ACTIVITY*").as("getAttachments");
        // cy.intercept("**GetDocumentArchives*NOTE_ACTIVITY*").as("getArchives");
        cy.get(`${listViewSelector}:visible`).within(() => {
            cy.get(`${this.easyListViewSection.selector}:visible`).each((item, index, list) => {
                if (text === "") {
                    cy.wrap(item).find(this.easyListViewSection.viewButton).click().wait(1000);
                    return false;
                } else {
                    cy.wrap(item).then(noteItem => {
                        let actualNote = noteItem.find(this.easyListViewSection.bodySection).text().trim().toUpperCase();
                        if (actualNote === text.toUpperCase()) {
                            cy.wrap(item).find(this.easyListViewSection.viewButton).click().wait(1000);
                            return false;
                        }
                    });
                }
            });
        });
        cy.waitForPageLoaded();
        // cy.waitForRequest("getAttachments");
        // cy.waitForRequest("getArchives");
    }

}