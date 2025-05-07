import { CommonElements } from "./CommonElements";
const commonElements = new CommonElements();
export class ConfigurationsPage {
    // Table section
    tableSection = "table[class^='table table-hover']";


    selectDocumentType(value) {
        cy.log("Select Document Type");
        cy.get(commonElements.nvDropdownContainer).click();
        cy.get(`${commonElements.nvDropdownPanel}:visible`).first().within(() => {
            cy.get(commonElements.nvDropdownPanel_searchTxt).type(value);
            cy.wait(200);
            cy.contains(commonElements.nvDropdownPanel_options_label, value).click();
        });
    }

    addDocumentType() {
        cy.log("Click 'Add Document Types' button");
        cy.get(commonElements.addBtn).click();
    }

    deleteNotificationGroup(value) {
        let rowIndex = -1;
        cy.inputValueByPlaceHolder("Search", value);
        cy.wait(1000);
        cy.get(`${this.tableSection}:visible`).first().within(table => {
            let tableContent = table.find("tbody tr td").first().text().trim();
            console.log("tableContent: " + tableContent);
            if (!tableContent.startsWith("No data available") && !tableContent.startsWith("No matching records")) {
                const sourceHeader = "Document Types";
                cy.get("thead").contains('th', sourceHeader, { matchCase: false }).invoke('index').then((sourceCol) => {
                    cy.get("tbody > tr").then($rowElement => {
                        for (let index = 0; index < $rowElement.length; index++) {
                            cy.wrap($rowElement).eq(index)
                                .find("td").eq(sourceCol).find("span span").invoke('text').then(text => {
                                    if (text.toLowerCase() === value.toLowerCase()) {
                                        rowIndex = index;
                                        return rowIndex;
                                    }
                                });
                        }
                    });
                }).then(index => {
                    if (index >= 0) {
                        cy.get("thead").contains('th', "Action", { matchCase: false }).invoke('index').then(($destinationCol) => {
                            cy.get("tbody > tr").eq(rowIndex).then($destinationCell => {
                                cy.wrap($destinationCell).find("td").eq($destinationCol)
                                    .find("span context-menu button").click() // to open context-menu
                            })
                        });
                        cy.wait(1000);
                        cy.root().parents("body").find(commonElements.nvContextMenuContainer).then(menu => {
                            for (let index = 0; index < menu.length; index++) {
                                const menuElement = menu[index];
                                if (menuElement.innerText.trim().includes("Delete")) {
                                    cy.wrap(menu).find("li a").contains("Delete").click();
                                    cy.wait(1000);
                                    cy.root().closest("body").contains(`${commonElements.confirmButton}:visible`, "Confirm").click();
                                    cy.wait(1000);
                                    return false;
                                }
                            }
                        });
                    }
                });
            }
        });
    }

    verifyNotificationGroupIsAvailable(columnHeader, searchText) {
        cy.get(`${this.tableSection}[id='document-notification-groups']:visible`).then(table => {
            let tableContent = table.find("tbody tr td").first().text().trim();
            if (!tableContent.startsWith("No matching records found")) {
                cy.get("thead").contains("th:visible", columnHeader, { matchCase: false })
                    .invoke("index").then((index) => {
                        cy.get("tbody > tr:visible").then($rowElement => {
                            var trigger = false;
                            const noOfRows = $rowElement.length;
                            for (let nthRow = 0; nthRow < noOfRows; nthRow++) {
                                const $tdEle = $rowElement.get(nthRow);
                                const $span = $tdEle.getElementsByTagName("td")
                                    .item(index).querySelector("span");
                                const text = $span.innerText;
                                if (text.toLowerCase().endsWith(searchText.toLowerCase())) {
                                    $span.style.backgroundColor = "red";
                                    trigger = true;
                                }
                            }
                            assert.isTrue(trigger, `${searchText.toUpperCase()} is found under Column: ${columnHeader.toUpperCase()}`);
                        });
                    });
            }
        });
    }
}
