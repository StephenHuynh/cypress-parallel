import { ResultTable } from "./ResultTable";
const table = new ResultTable();
export class Dashboard {
    // Dashboard Config Section 
    dashboardConfigSection = {
        selector: "nv-dashboard-configuration-toolbar", //"*[class='dashboard-config-tools']",
        headerSelector: "span[class^='title-text']",
        // buttonSelector: "a[class='link']",
        buttonSelector: ".link",
        closeButton: "span[ng-click*='cancelEditMode']",
        changeLayoutButton: "span[ng-click*='editDashboardLayoutDialog']",
        findDashboardButton: "span[ng-click*='sharedDashboardDialog']",
        saveButton: "span[ng-click*='saveToggleEditMode']",
        createDashboardButton: "span[ng-click*='createNewDashboard']",
        shareDashboardSlider: "span[class^='slider']",
        settingsMenu: "button[class*='menu-item']",
        alternatepencil:".fa-pencil-alt"
    }

    // Dashboard Section 
    dashboardSection = {
        selector: "nv-dashboard-row", //"div[class^='dashboard-row']",
        addWidgetButton: "a[class*='add-column']", //"div[class^='add-column'] span",
        // Widget Section
        widgetSection: {
            selector: "div[widget-type]",
            headingWidgetSelector: "div[class^='widget-heading']",
            titleWidgetSelector: "h3[class='widget-title'] span",
            editWidgetSelector: "span[class$='widget-title-tool'] > a[title='Edit widget configuration']",
            removeWidgetSelector: "span[class$='widget-title-tool'] > a[title='Remove widget']"
        }
    }

    // Aside Port
    asidePortSelector = {
        selector: "aside[class^='view-port']",
        widgetCardSection: {
            selector: "a[class='widget-card']",
            headerSelector: "h4",
        }
    }

    dashboardWidgetContainer = "nv-dashboard-widget nv-dashboard-widget-content";
    dashboardWidgetContainer_activeSessionWidget = "bo-user-online-widget";
    dashboardWidgetContainer_header = "header";


    verifyActiveSessionHeaderExisted() {
        cy.get(this.dashboardWidgetContainer)
            .find(this.dashboardWidgetContainer_activeSessionWidget).within(() => {
                table.verifyHeaderExisted("Name");
                table.verifyHeaderExisted("IP");
                table.verifyHeaderExisted("User Agent");
            }); 
    }

    verifyActiveSession(sourceHeader = "Name", sourceValue, searchHeader = "IP") {
        cy.get(this.dashboardWidgetContainer)
            .find(this.dashboardWidgetContainer_activeSessionWidget).within(() => {
                cy.get(`${table.resultTableSection.tableSection['selector']}:visible`).within(() => {
                    cy.getRowIndexBy(sourceHeader, sourceValue).then(rowIndex => {
                        cy.get("thead").contains("th:visible", searchHeader, { matchCase: false })
                            .invoke("index").then(($destinationCol) => {
                            cy.get("tbody > tr:visible").eq(rowIndex)
                                .then(($destinationCell) => {
                                    cy.wrap($destinationCell).find("td")
                                    .eq($destinationCol).find("span").invoke("text")
                                        .then((text) => text.toLowerCase().trim())
                                        .should("contain", ".");
                                });
                        });
                    });
                });
            });
    }

    addWidget() {
        // Click Configure your dashboard icon on Header
        cy.get(`${this.dashboardSection.selector}:visible`).first().within((view) => {
            cy.get(`${this.dashboardSection.addWidgetButton}:visible`).click();
        });
    }

    addGeneralWidget(label) {
        cy.get(`${this.asidePortSelector.selector}`).scrollIntoView().within((view) => {
            let { widgetCardSection } = this.asidePortSelector;
            cy.get(`${widgetCardSection.selector}`).then((card) => {
                const cards = card.length
                for (let index = 0; index < cards; index++) {
                    let headerText = card.find(widgetCardSection.headerSelector).get(index).textContent
                    if (headerText === label) {
                        return card.get(index);
                    }
                }
            }).then((cardSelector) => {
                cy.wrap(cardSelector).click();
            })
        });
        cy.wait(500);
        cy.waitForPageLoaded();
    }

    click(label) {
        cy.get(`${this.dashboardConfigSection.selector}`).scrollIntoView().within((view) => {
            switch (label.toLowerCase()) {
                case "close":
                    cy.get(`${this.dashboardConfigSection.buttonSelector}:visible`).contains("Close").click();
                    break;
                case "share":
                    cy.get(`${this.dashboardConfigSection.shareDashboardSlider}:visible`).click();
                    break;
                case "save":
                    // cy.get(`${this.dashboardConfigSection.saveButton}:visible`).click();
                    cy.get(`${this.dashboardConfigSection.buttonSelector}:visible`).contains("Save").click();
                    break;
                default:
                    break;
            }
        });
        cy.wait(1000)
        cy.waitForPageLoaded();
    }

    verifyNewlyAddedGeneralWidget(label) {
        cy.get(`${this.dashboardSection.selector}`).first().within((view) => {
            let { widgetSection } = this.dashboardSection;
            cy.get(`${widgetSection.selector}`).last().within((widget) => {
                let headerText = widget.find(widgetSection.titleWidgetSelector).text();
                expect(headerText).to.be.equal(label);
            })
        });
    }

    verifyDashboardHeader(value) {
        cy.get(`${this.dashboardConfigSection.selector}`).within((view) => {
            let { headerSelector } = this.dashboardConfigSection;
            cy.get(`${headerSelector}`).should("have.text", value);
        });
    }

    clickDashboardSettings(label) {
        cy.clickButton("Settings");
        switch (label.toLowerCase()) {
            case "edit":
                cy.get(`${this.dashboardConfigSection.settingsMenu}:visible`).contains("Edit Dashboard").click();
                break;
            case "create":
                cy.get(`${this.dashboardConfigSection.settingsMenu}:visible`).contains("Create Dashboard").click();
                break;
            case "clone":
                cy.get(`${this.dashboardConfigSection.settingsMenu}:visible`).contains("Clone Dashboard").click();
                break;
            case "find":
                cy.intercept("**SearchSharedUserConfig*userDashboard*").as("getSharedDashboard");
                cy.get(`${this.dashboardConfigSection.settingsMenu}:visible`).contains("Find Dashboard").click();
                cy.waitForRequest("getSharedDashboard");
                break;
            case "change":
                cy.get(`${this.dashboardConfigSection.settingsMenu}:visible`).contains("Change Layout").click();
                break;
            default:
                break;
        };
        cy.waitForPageLoaded();
    }

    clickAlternatePencilIcon(){
        cy.get(`${this.dashboardConfigSection.alternatepencil}:visible`).click();
    }


}