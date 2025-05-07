export class Header {

    headerSectionSelector = "header[data-ui-view='portalHeader']";
    buttonSelector = "button";

    addConfigMenuSelector = "[class*='dropdown-menu config-menu']"
    notificationMenuSelector = "section[class*='dropdown-menu notification task ng-scope']"

    globalSearchText = "input[id='global-search-txt']";

    dropDownMenu = "section[class^='dropdown-menu notification ']";
    itemSelector = "bo-activity-notification-item";
    titleTxt = "span";
    userProfileLink = "bo-user-profile-link";
    profileIconSelector = "bo-user-profile-header > button" 
    
    moduleHeaderSelector = "header[data-ui-view='portalHeader'] bo-app-launcher span[class='brand'] span"

    clickButton(title) {
        cy.get(this.headerSectionSelector).should("be.visible").within(() => {
            cy.get(`${this.buttonSelector}[title='${title}']`).should("be.visible").click();
            cy.wait(1000);
        });        
    }

    addingNewItem(text) {
        this.getAddButton().click();
        cy.get(this.addConfigMenuSelector).contains(text).click();
        cy.waitForPopUpDisappeared();
    }
    
    clickTaskNotification(){
        this.getNotificationButton().click();
        cy.wait(1000);
    }
    seeAllNotifications() {
        cy.get(this.dropDownMenu).should("be.visible").within(() => {
            cy.get("a").contains("See All").click();
            cy.wait(1000);
        });        
    }

    logOut(){
        cy.get(this.profileIconSelector).click().wait(500);
        cy.contains("a", "Logout").click();
        cy.get("div[role='alertdialog']:visible").within(() => {
            cy.get("button[title='Confirm']").click();
        });
        cy.wait(500);
    }
    
    getPortalHearder() {
        return cy.get("header[data-ui-view='portalHeader']");
    }

    getAppLauncher() {
        return cy.get("span[class='app-drawer'] button", {timeout: 20000});
    }

    getBranch() {
        return cy.get("span[class='brand'] span");
    }

    getGlobalSearchInput() {
        return cy.get("#global-search-txt");
    }

    getDashboardButton() {
        return cy.get("button[title='Configure your dashboard']");
    }

    getHistoryButton() {
        return cy.get("#header_history_bar > button"); 
    }

    getNotificationButton() {
        return cy.get("span[id*='header_notification_bar'] > button"); 
    }

    getBrokerNotificationButton() {
        return cy.get("#header_broker_notification_bar > button"); 
    }

    getAddButton() {
        return cy.get("bo-user-global-add > a"); 
    }
    
    getUserSettingButton() {
        return cy.get("bo-user-profile-header > button"); 
    }

    inputGlobalSearch(text) {
        cy.get(this.globalSearchText).type(text);
    }

    verifyGlobalSearchResult(text) {
        this.inputGlobalSearch(text);
    }


    verifyTitleOfNewlyCreatedTask(text) {
        cy.get(this.dropDownMenu).should("be.visible").within(() => {
            cy.get(this.itemSelector).first().within(() => {
                cy.get(this.titleTxt).first().invoke("text").then(
                    title => expect(title.trim()).equal(text, "Title is expected !"));
            });
        });
    }

    verifyCreatorOfNewlyCreatedTask(creator) {
        cy.get(this.dropDownMenu).should("be.visible").within(() => {
            cy.get(this.itemSelector).first().within(() => {
                cy.get(this.userProfileLink).then(profile => {
                    expect(profile.trim()).contain(creator, "User is expected !");
                });
            });
        });
    }

    verifyCreatedTimeOfNewlyCreatedTask() {
        cy.get(this.dropDownMenu).should("be.visible").within(() => {
            cy.get(this.itemSelector).first().within(() => {
                cy.get(this.userProfileLink).then(profile => {
                    expect(profile.next("span")).contain("a few seconds ago", "Time is expected !");
                });
            });
        });
    }

    clickTitleOfNewlyCreatedTask(text) {
        cy.get(this.dropDownMenu).should("be.visible").within(() => {
            cy.get(this.itemSelector).first().within(() => {
                cy.get(this.titleTxt).contains(text).click();
                cy.wait(1000);
            });
        });
    }
}
