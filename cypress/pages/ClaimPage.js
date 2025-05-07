import { DialogElements } from "../pages/DialogElements";
import { ResultTable } from "../pages/ResultTable";
import { CommonElements } from "../pages/CommonElements";
import { filterObject } from "../support/utils";
const dialog = new DialogElements();
const resultTable = new ResultTable();
const common = new CommonElements();
/*
    Page Object for Claim Page
*/
export class ClaimPage {
    // Main container
    editButtonSelector = "button[title='Edit']";
    changeReservesButtonSelector = "button[title='Change Reserves']";
    backButtonSelector = "button[title='Back to Search Claims']";
    tabLinkSelector = "claim-process-main li > a";

    // Claim Information - Right Panel
    rightPanelSelector = "section[class^='information']";
    inforHeaderSelector = "dt";
    inforValueSelector = "dd";

    // Context-menu
    contextMenuSelector = "header nv-action-menu";

    offerContextMenuSelector = `header ${common.nvActionMenu}`;

    nvMenuItem = `${common.nvMenuItem} button`;
    contextMenuOptions = `${common.nvContextMenuContainer} li`;

    // Agreement Context-menu
    contextAgreementMenuSelector = "header nv-context-menu";
    offerContextAgreementMenuSelector = `header ${common.nvContextMenu}`;
    //nvAgreementMenuItem = "span[class='menu-item-text']";
    nvAgreementMenuItem = "span[class='menu-item-text']";

    // Dialog PopUp
    cdkOverlayContainerSelector = "div[class='cdk-overlay-container']";
    popUpSelector = "section[class*='dialog']";
    confirmButton = "button[class$='btn-primary']";
    closeButton = "button[class$='btn-default']";

    // loadingIcon
    processLoading = "nv-loading-overlay[title*='Processing']";

    recoveryAmountInput = "input[id='$ctrl.claimForm.PotentialRecoveryAmount']";

    warningMessage = "div[ng-if*='displayWarningMessage']"

    filterTextBox = "input[type='search']";

    advanceSearchEventIcon = "d-select[placeholder$='Event'] i[class$='advance-search-icon']";

    contextMenuItem = "nv-context-menu-item li a span";

    statusHistoryDiagram = "section[class*='d-diagram']"
    statusHistoryHeader = "header h3"
    statusHistoryContainer = "article[class='history-chart-container']"
    statusHistoryNode1 = "g[class^='node lv2']"
    statusHistoryNode1_Date = "text[class='textTitle']"
    statusHistoryNode1_User = "text[class='textContent']"
    statusHistoryNode1_Status = "text > tspan[class='textStatus']"

    settlementSectionSelector = "process-claim-settlement";
    // settlementHeaderSelector = "header > h4";
    settlementHeaderSelector = "header";
    settlement_IngoingInvoiceSection = "div[class='row']";
    settlement_IngoingInvoice_AddBtn = "claim-ingoing-invoice-grid button";
    settlement_IngoingInvoiceTable = "claim-ingoing-invoice-grid table";
    settlement_InvoiceLinesSelector = "claim-ingoing-invoice-details-line-with-spread-sheet";
    settlement_InvoiceLinesDialog = "section[class^='dialog view-port']";
    settlement_DeductibleSummarySalaryExpenseSection = "div[class='row middle']";
    settlement_DeductibleSection = "easy-datatable[table-options*='deductibleTable']";
    settlement_DeductibleTable = "easy-datatable[table-options*='deductibleTable'] table";
    settlement_Deductibles_AddBtn = "claim-ingoing-invoice-grid button";
    settlement_PaymentSection = "div[class*='settlement-payment-table']";
    settlement_PaymentTable = "claim-settlement-payments table";
    settlement_Payment_AddBtn = "a[data-ng-click*='PLPayment']";
    settlement_CasualtySalary_AddBtn = "a[data-ng-click*='CasualtySalary']";
    settlement_CasualtySalary_CheckBox = "input[type='checkbox'][id*='CasualtySalary']";
    settlement_CasualtySalary_Input = "input[type='text'][id*='CasualtySalary']";
    confirmDialogSelector = "div[role='alertdialog']";

    settlement_InternalExpense_AddBtn = "a[data-ng-click*='InternalExpense']";
    settlement_InternalExpense_Input = "input[type='text'][id*='InternalExpense']";

    
    cdkOverlayContainerSelector = "div[class='cdk-overlay-container']";
    dialogSectionSelector = "div[role='document']";

    selectValueFromReserveTable(column, value){
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).first().within(() => {
                cy.get(`d-select[placeholder$='Select ${column}']`)
                    .find("input").then((input) => {
                        cy.wrap(input).parent("div").then(divParent => {
                            if(divParent.find("div[class='item'] > a[title]").length){
                                cy.wrap(divParent.find("div[class='item'] > a[title]")).click().wait(200);
                            }
                            cy.wrap(divParent).children("input").type(value).wait(800);
                        });
                });
            });
        });
        cy.get(".selectize-dropdown-content:visible").contains(value, {matchCase: false}).click();
    }


    goToTab(label) {
        cy.get(`${this.tabLinkSelector}[title='${label}']:visible`).click().wait(1000);
        cy.waitForPageLoaded();
    }

    verifyTabDisabled(label) {
        cy.get(`${this.tabLinkSelector}[title='${label}']`).then($tab => {
            let disabled = false;
            if ($tab.hasClass("disabled"))
                disabled = true;
            assert.isTrue(disabled, `Tab: ${label.toUpperCase()} is disabled!`);
        });
    }

    verifyTabEnabled(label) {
        cy.get(`${this.tabLinkSelector}[title='${label}']`).then($tab => {
            let enabled = false;
            if (!$tab.hasClass("disabled"))
                enabled = true;
            assert.isTrue(enabled, `Tab: ${label.toUpperCase()} is enabled!`);
        });
    }

    // Payment Tab
    verifyELInternationalPaymentFields() {
        cy.clickButton("EL-Payment Pay/Reg - International");
        cy.waitForPopUpDisappeared();
        dialog.confirmWarningDialog();
        cy.get(`${this.popUpSelector}`).then($popUp => {
            if ($popUp.length) {
                // Verify the fields 
                cy.contains("Payment Information");
                cy.contains("Currency")
                cy.contains("Amount")
                cy.contains("Receiver")
                cy.contains("Legal Receiver")
                cy.contains("Due Date")
                cy.contains("Accounting Group")
                cy.contains("Attention")
                cy.contains("Country")
                cy.contains("PL Text")
                cy.contains("Note")
                cy.contains("Address 1")
                cy.contains("Address 2")
                cy.contains("Address 3")
                cy.contains("Banking Information")
                cy.contains("Our Bank Account")
                cy.contains("Bank Name")
                //cy.contains("Reference Invoice 1")
                //cy.contains("Reference Invoice 2")
                //cy.contains("Reference Invoice 3")
                cy.contains("IBAN/Receiver Bank Account")
                cy.contains("Swift")
                //cy.contains("Country")
                cy.contains("Expense Domestic")
                cy.contains("Expense Abroad")
                cy.contains("Reporting Code")
                //cy.contains("Via Swift")
                //cy.contains("Clearing System Id")
                //cy.contains("Reporting Text")
                //cy.contains("Via Swift")
                //cy.contains("Address 1")
                //cy.contains("Urgent")
                //cy.contains("Address 2")
                //cy.contains("Address 3")

                // cy.contains("Settlement")
                // cy.contains("Add")
                //cy.contains("Claim Category")
                //cy.contains("Currency")
                //cy.contains("To Be Settled")
                //cy.contains("To Be Settled 100%")
                //cy.contains("Current Reserve")
                //cy.contains("Reserve 100%")
                //cy.contains("Settled Action")
            }
            this.cancelAction();
        })
    }

    // Payment Tab
    verifyPLOnlyFields() {
        cy.clickButton("PL-Only");
        dialog.confirmWarningDialog();
        cy.get(`${this.popUpSelector}`).then($popUp => {
            if ($popUp.length) {
                // Verify the fields 
                cy.contains("Transaction Information")
                cy.contains("Currency")
                cy.contains("Amount")
                cy.contains("Receiver")
                cy.contains("Legal Receiver")
                cy.contains("Due Date")
                cy.contains("Accounting Group")
                cy.contains("Payment Code")
                cy.contains("PL Text")
            }
            this.cancelAction();
        })
    }

    verifyInformation(header, value) {
        cy.get(this.rightPanelSelector).within(() => {
            cy.get(this.inforHeaderSelector).then((headerName) => {
                for (let index = 0; index < headerName.length; index++) {
                    const headerText = headerName[index].textContent.trim();
                    if (headerText.includes(header)) {
                        let node = headerName[index].nextElementSibling
                        return node;
                    }
                }
            }).then((element) => {
                cy.wrap(element).invoke('attr', 'style', 'background-color: red')
                    .invoke("text").then(text => {
                        expect(text.trim().toUpperCase()).to.contain(value.toUpperCase());
                    });
            });
        });
    }

    getInformation(header) {
        cy.get(this.rightPanelSelector).then(() => {
            cy.get(this.inforHeaderSelector).then((headerName) => {
                for (let index = 0; index < headerName.length; index++) {
                    const headerText = headerName[index].textContent.trim();
                    if (headerText.includes(header)) {
                        let node = headerName[index].nextSibling;
                        console.log(node);
                        console.log("--------");
                        console.log(node.nextSibling);
                        return node.nextSibling;
                    }
                }
            });
        }).then((element) => {
            console.log(`Element ${element}`);
            console.log(element);
            const preEle = element.find('pre');
            console.log("---PRE-----");
            console.log(preEle);
            cy.wrap(preEle).invoke("text").then(txt => {
                console.log(`ID: ${txt}`);
                // return cy.wrap(txt);
                Cypress.env("claim", txt);
            });
            // return cy.wrap(preEle).invoke("text");
            // return preEle;
            //     .then(text => {
            //     return text
            // });
            // 
        });
        return
    }

    verifyActionOptions() {
        cy.get(`${common.nvActionMenu}:visible`).click();
        cy.contains("Actions")
        cy.contains("Open")
        cy.contains("Close")
        cy.contains("Delete")
        cy.contains("Undo Delete")
        cy.contains("Confirm Reserves")
        cy.contains("Received Bordereau")
        cy.contains("Settle Balance")
        cy.contains("Produce Letter")
        cy.contains("Inquiry")
        cy.contains("Status History")
        cy.contains("Reserve History")
        cy.contains("Transaction Status")
        cy.contains("Accounting Per. Document#")
        cy.contains("Accounting Sum Per. Category")
        cy.contains("Personal Ledger")
        cy.contains("Open Insurance Policy")
    }

    verifyAgreementActionOptions() {
        cy.get(`${common.nvContextMenu}:visible`).click();
        cy.contains("Renew To Offer")
    }

    verifyAvailableAction(actionText) {
        cy.get(`${common.nvActionMenu}:visible`).then(() => {
            cy.get("body").then(body => {
                if (body.find(this.nvMenuItem).length === 0)
                    cy.get(common.nvActionMenu).click().wait(1000);
            });
            cy.contains(`${this.nvMenuItem}`, actionText).then(($btnElement) => {
                assert.isTrue($btnElement.prop("disabled") === false, `${actionText} action is available!`);
            });
        });
    }

    /**
     * @description Verifies that a specific action is unavailable in the action menu.
     * @param {string} actionText - The text of the action to verify.
     */
    verifyUnavailableAction(actionText) {
        cy.get(`${common.nvActionMenu}:visible`).then(() => {
            cy.get("body").then(body => {
                if (body.find(this.nvMenuItem).length === 0)
                    cy.get(common.nvActionMenu).click().wait(500);
            });
            cy.contains(`${this.nvMenuItem}`, actionText).then(($btnElement) => {
                assert.isTrue($btnElement.prop("disabled"), `${actionText} action is NOT available!`);
            });
        });
    }

    /**
     * @description is used to perform the Action on Claim Detail page,
     * by clicking on ... button.
     * @param {string} actionText: action to perform on Claim
     */
    performAction(actionText) {
        cy.get(`${common.nvActionMenu}:visible`).click();
        cy.waitForPageLoaded();
        cy.get(`${this.nvMenuItem}:visible`).contains(actionText).then(($btnElement) => {
            cy.wait(1000);
            if (!$btnElement.is(":disabled")) {
                $btnElement.click();
            } else {
                assert.isFalse(true, `The claim is unable to ${actionText} !`);
            }
        });
        cy.wait(1000);
        cy.waitForPageLoaded();
    }

    /**
 * @description is used to perform the Action on Agreement Detail page,
 * by clicking on ... button.
 * @param {string} actionText: action to perform on Agreement
 */
    performActionAgreementHeader(actionText) {
        cy.get(`${this.contextAgreementMenuSelector}:visible`).click();
        cy.waitForPageLoaded();
        cy.get(`${this.nvAgreementMenuItem}:visible`).contains(actionText).then(($btnElement) => {
            if (!$btnElement.is(":disabled")) {
                $btnElement.click();
            } else {
                assert.isFalse(true, `The Agreement is unable to ${actionText} !`);
            }
        });
        cy.wait(1000);
        cy.waitForPageLoaded();
    }


    // Will be replaced with 'confirmDialog' from DialogElements.js
    confirmAction() {
        cy.get(dialog.cdkOverlayContainerSelector).wait(1000).within(($popUpContainer) => {
            if ($popUpContainer.children(dialog.childDiv).length) {
                cy.get(`${this.confirmButton}:visible`).click();
            }
        });
        cy.wait(1000);
    }

    // Will be replaced with 'closeDialog' from DialogElements.js
    cancelAction() {
        cy.get(`${this.popUpSelector}:visible`).first().within(() => {
            cy.get(`${this.closeButton}:visible`).click();
            cy.wait(1000);
        });
    }

    waitForProcessCompleted(counter = 0) {
        cy.get(`${this.processLoading}`).then($element => {
            if ($element.is(":visible") && counter <= 30) {
                counter = counter + 1;
                cy.log("Waiting for Process completed ...");
                cy.wait(1000);
                this.waitForProcessCompleted(counter);
            }
        });
    }

    clickEditButton() {
        cy.get(common.nvButton).contains("Edit").click().wait(500).then(() => {
            if (Cypress.$(this.confirmDialogSelector).length) {
                // Cypress.$("button[type][title='Yes']").click();
                Cypress.$(`${common.nvButton}:contains('Yes')`).click();
            };
        });
    }

    verifyWarningMessageForClaim(status) {
        cy.get(this.warningMessage).then($element => {
            expect($element.text().trim().toLowerCase()).to.include("warning! cannot modify claim, status is: " + status.toLowerCase());
        })
    }

    inputRecoveryAmount(value) {
        cy.get(this.recoveryAmountInput).type(value);
    }

    saveClaim() {
        cy.get("footer:visible").within(() => {
            cy.contains("button", "Save").click();
        });
        cy.wait(2000);
        cy.verifyPopUp("Claim has been created successfully.");
        cy.wait(30000);
    }

    updateClaim() {
        cy.get("footer:visible").within(() => {
            cy.get("button").find('span').contains('Save').click().wait(500);
        });
        this.waitForProcessCompleted();
        cy.wait(1000);
        cy.verifyPopUp("Claim has been updated successfully.");
        cy.waitForPageLoaded();
    }

    filterTheResult(value) {
        (value !== "" && value !== undefined) ? cy.get(`${this.filterTextBox}:visible`).clear().type(value)
            : cy.get(`${this.filterTextBox}:visible`).clear().realPress("Tab");
        cy.wait(500);
    }

    addNewReserve(claimCategory, currency, amount, note, ourShare = 100, env = "noriaDev") {
        cy.intercept('POST', '**?plugin=InitClaimReserve*').as('initClaimReserve');
        dialog.clickButton("Add");
        cy.wait('@initClaimReserve').its('response.statusCode').should('eq', 200);
        this.selectValueFromReserveTable("Claim Category", claimCategory);
        this.selectValueFromReserveTable("Currency", currency);
        dialog.inputValueForLastRowInTable("Reserve", amount);
        cy.realPress("Tab");
        // Need to verify the Reserve 100%
        dialog.verifyRowBasedOnColumHeader("Reserve 100%", (parseInt(amount) / (ourShare / 100)).toLocaleString().concat(".00")); // Reserve 100% = Reserve / OurShare
        dialog.inputValueForTextArea(note);
        cy.intercept('POST', '**?plugin=SaveClaimReserve*').as('saveClaimReserve');
        dialog.clickButton("Save");
        // if (env.toLowerCase().includes("gard")) {
        //     cy.get(dialog.cdkOverlayContainerSelector).wait(1000).within(() => {
        //         cy.get(common.nvButton).contains("Yes").click();      
        //     });
        // }
        // dialog.confirmDialog();
        cy.wait('@saveClaimReserve').its('response.statusCode').should('eq', 200);
        cy.verifyPopUp("Reserve has been updated successfully");
        cy.waitForPageLoaded();
    }

    editReserve(claimCategory, amount, note, env = "noriaDev") {
        cy.waitForPageLoaded();
        dialog.inputRowValueBasedOnColumHeaderAndRow("Claim Category", claimCategory, "Reserve", amount);
        dialog.inputValueForTextArea(note);
        dialog.save();
        // if (env.toLowerCase().includes("gard")) {
        //     cy.get(dialog.cdkOverlayContainerSelector).wait(1000).within(() => {
        //         cy.get(common.nvButton).contains("Yes").click();      
        //     });
        // }
        dialog.confirmDialog();
        cy.verifyPopUp("Reserve has been updated successfully");
        cy.waitForPageLoaded();
    }

    /**
     * used to create new PL-Only Payment for Claim.
     * Currently, add New Payment without Document # and Account Group (use default value)
     * @param {object} paymentObject data for input/select
     */
    addNewPLPayment(paymentObject) {
        const defaultCommonObj = {
            "Currency": "",
            "Amount": "",
            "Receiver": "",
            "Due Date": "",
            "Legal Receiver": "",
            "Accounting Group": "",
            "Payment Code": "",
            "Bordereau Text": "",
        };

        const defaultGardObj = {
            "Currency": "",
            "Amount": "",
            "Receiver": "",
            "Exchange Currency": "",
            "Exchange Amount": "",
            "Legal Receiver": "",
            "Valid From": "",
            "Document Date": "",
            "Payment Code": "",
            "Tax Code": "",
            "Due Date": "",
            //  "DM Document #": "",
            // "Accounting Group": "",
            "Amount Number": "",
            "Message to EL Remit": "",
            "To Be Paid": "",
            "Bordereau Text": "",
        };

        const allUnionProps = {}; // An object of data need to input/select 

        for (let key in defaultGardObj) {
            allUnionProps[key] = paymentObject.hasOwnProperty(key)
                ? paymentObject[key]
                : defaultGardObj[key];
        }

        // remove all empty value of key in object(no need to input or select value)
        let notEmptyValueObject = filterObject(allUnionProps,
            value => value !== "");

        cy.clickButton("PL-Only");
        dialog.confirmDialog();
        cy.waitForPopUpDisappeared();
        // Fill in the details
        for (let key in notEmptyValueObject) {
            dialog.enterValue(key, notEmptyValueObject[key]);
        }
        dialog.inputValueForTextArea("Create a new payment");
        // dialog.save();
        dialog.clickButton("Save");
        dialog.confirmDialog();
        dialog.confirmDialog(); // For Duplicated Payment
        cy.wait(1000);
        dialog.clickButton("Save");
        cy.verifyPopUp("Payment has been created successfully");
        this.waitForProcessCompleted();
    }

    settleBalance(amount) {
        this.performAction("Settle Balance");
        dialog.inputValueForFirstRowInTable("To Be Settled", amount);
        dialog.inputValueForTextArea("Settle Balance");
        dialog.clickButton("Save");
        cy.verifySuccessMessagePopUp("Balance has been settled successfully");
    }

    openSearchEventPopUp() {
        cy.get(this.advanceSearchEventIcon).click();
        cy.waitForElementVisible(this.popUpSelector);
        cy.wait(1000);
    }

    changeDocumentStatusTo(status) {
        cy.intercept('POST', '**?plugin=UpdateDocumentArchiveStatus*').as('update');
        cy.setRequest("GetDocumentArchives");
        cy.clickButton("Change Status");
        cy.get(`${this.nvMenuItem}:visible`).contains(status).click();
        cy.wait('@update').its('response.statusCode').should('eq', 200);
        cy.verifyPopUp("Status has been updated successfully");
        cy.waitForRequest("GetDocumentArchives");
    }

    /**
     * @description is used to verify the Status History Header
     * and it should be "Status History"
     */
    verifyStatusHistoryHeader() {
        cy.get(`${this.statusHistoryDiagram}:visible`).within(() => {
            cy.get(`${this.statusHistoryHeader}:visible`).invoke("text").should("equal", "Status History");
        });
    }

    /**
     * @description is used to verify the First Node's value in Status History
     */
    verifyFirstNodeInStatusHistory(date, user, status) {
        cy.get(`${this.statusHistoryDiagram}:visible`).within(() => {
            cy.get(`${this.statusHistoryContainer}:visible`).within(($container) => {
                let dateNode = $container.find(`${this.statusHistoryNode1} ${this.statusHistoryNode1_Date}`).text().trim().substring(0, 10);
                let userNode = $container.find(`${this.statusHistoryNode1} ${this.statusHistoryNode1_User}`).text().trim();
                let statusNode = $container.find(`${this.statusHistoryNode1} ${this.statusHistoryNode1_Status}`).text().trim();
                expect(userNode).to.equal(user, "User is matched");
                expect(statusNode).to.equal(status, "Status is matched");
                expect(dateNode).to.equal(date, "Date is matched");
            });
        });
    }

    verifySettlementHeader_toBeDeleted(label) {
        cy.get(this.settlementSectionSelector).within(() => {
            cy.get(this.settlementHeaderSelector).then($headers => {
                const noOfHeader = $headers.length;
                var trigger = false;
                for (let nthHeader = 0; nthHeader < noOfHeader; nthHeader++) {
                    let headerText = $headers.get(nthHeader).innerText.trim().toUpperCase();
                    console.log("Header Text: ", headerText);
                    if (headerText.startsWith(label.toUpperCase())) {
                        trigger = true;
                    }
                }
                assert.isTrue(trigger, `${label.toUpperCase()} is found!`);
            });
        });
    }

    verifySettlementHeader(label) {
        cy.get(this.settlementSectionSelector).within(() => {
            cy.get(this.settlementHeaderSelector).then($headers => {
                assert.isTrue($headers.find(`h4:contains('${label}')`).length > 0, `${label.toUpperCase()} is found!`);
            });
        });
    }

    clickAddInvoice() {
        cy.get(this.settlementSectionSelector).within(() => {
            cy.get(this.settlement_IngoingInvoice_AddBtn).click().wait(500);
        });
        cy.waitForPageLoaded();
    }

    verifyInvoiceLineRow(columnHeader, rowValue) {
        cy.get(this.settlementSectionSelector).within(() => {
            cy.get(this.settlement_InvoiceLinesDialog).within(() => {
                let tableSelector = "table";
                cy.get(`${tableSelector}:visible`).within(() => {
                    cy.get("thead").scrollIntoView().contains("th:visible", columnHeader, { matchCase: false }).invoke("index").then((index) => {
                        cy.get("tbody > tr:visible").then($rowElement => {
                            var trigger = false;
                            const noOfRows = $rowElement.length;
                            for (let nthRow = 0; nthRow < noOfRows; nthRow++) {
                                const $td = $rowElement.get(nthRow).getElementsByTagName("td")
                                    .item(index);
                                const text = $td.innerText;
                                // console.log(`Text: ${text}`);
                                if (text.toLowerCase().endsWith(rowValue.toLowerCase())) {
                                    $td.style.backgroundColor = "red";
                                    trigger = true;
                                }
                            }
                            assert.isTrue(trigger, `${rowValue.toUpperCase()} is found under Column: ${columnHeader.toUpperCase()}`);
                        });
                    });
                });
            });
        });
    }

    clickOnSpecificIngoingInvoice(columnHeader, rowValue) {
        cy.get(this.settlementSectionSelector).within(() => {
            cy.get(this.settlement_IngoingInvoiceSection).within(() => {
                resultTable.clickOnRowBasedOn(columnHeader, rowValue);
            });
        });
    }

    clickOnSpecificDeductible(columnHeader, rowValue) {
        cy.get(this.settlement_DeductibleSummarySalaryExpenseSection).within(() => {
            cy.get(this.settlement_DeductibleSection).within(() => {
                resultTable.clickOnRowBasedOn(columnHeader, rowValue);
            });
        });
    }

    clickAddDeductible() {
        cy.get(this.settlementSectionSelector).within(() => {
            cy.get(this.settlementDeductibleSection).within(() => {
                cy.get(this.settlement_Deductibles_AddBtn).click().wait(500);
            });
        });
        cy.waitForPageLoaded();
    }

    verifySummaryValue(columnHeader, expectedValue) {
        cy.get(this.settlementSectionSelector).within(() => {
            cy.get(this.settlementHeaderSelector).then(($headers) => {
                let h4 = $headers.find("h4:contains('Summary')");
                let tblElement = h4.parents("div:first").find("table");
                let foundTd = tblElement.find("tr").find(`td:contains('${columnHeader}')`);
                let nextTd = foundTd.next();
                let actualValue = nextTd.text();
                assert.isTrue(actualValue.includes(expectedValue), `${columnHeader.toUpperCase()} != ${expectedValue} as expected!`);
            });
        });
    }

    /**
     * @description is used to verify the value from casualty salary table, have been inputted
     * @param {*} columnHeader 
     * @param {*} expectedValue 
     * @tutorial bestPractice for using CONTAINS to look for H4, 
     * then using setAttribute to add ID for particular element
     */
    verifyCasualtySalary(columnHeader, expectedValue) {
        cy.get(this.settlementSectionSelector).then(() => {
            cy.get(this.settlementHeaderSelector).then(($headers) => {
                let h4 = $headers.find("h4:contains('Casualty Salary')");
                console.log(h4);
                let tblElement = h4.parents("div:first").find("table").get(0);
                console.log(tblElement.setAttribute("id", "casualtySalary"));
                resultTable.verifyRowBasedOnColumHeader(columnHeader, expectedValue, "#casualtySalary");
            });
        });
    }

    verifyInternalExpense(columnHeader, expectedValue) {
        cy.get(this.settlementSectionSelector).then(() => {
            cy.get(this.settlementHeaderSelector).then(($headers) => {
                let h4 = $headers.find("h4:contains('Internal Expenses')");
                console.log(h4);
                let tblElement = h4.parents("div:first").find("table").get(0);
                console.log(tblElement.setAttribute("id", "internalExpense"));
                resultTable.verifyRowBasedOnColumHeader(columnHeader, expectedValue, "#internalExpense");
            });
        });
    }

    addInternalExpense(description, amount) {
        cy.get(`${this.settlement_InternalExpense_AddBtn}:visible`).click();
        cy.wait(500);
        dialog.verifyTitle("Edit Int expenses");
        cy.get(this.settlement_InternalExpense_Input).clear().type(amount);
        cy.wait(200);
        dialog.inputValue("Description", description);
        dialog.save();
        cy.verifyPopUp("Casualty salary has been saved successfully");
        this.waitForProcessCompleted();
        cy.waitForPageLoaded();
    }

    addCasualtySalary(amount) {
        cy.get(`${this.settlement_CasualtySalary_AddBtn}:visible`).click();
        cy.wait(500);
        dialog.verifyTitle("Edit Casualty salary");
        cy.get(this.settlement_CasualtySalary_CheckBox).then(chb => {
            if (!chb.is(":checked"))
                chb.click();
        });
        cy.wait(300);
        cy.get(this.settlement_CasualtySalary_Input).clear().type(amount);
        cy.wait(200);
        dialog.save();
        cy.verifySuccessMessagePopUp("Casualty salary has been saved successfully");
        this.waitForProcessCompleted();
        cy.waitForPageLoaded();
    }

    addPLPayment(paymentObject) {
        // remove all empty value of key in object(no need to input or select value)
        let notEmptyValueObject = filterObject(paymentObject,
            value => value !== "");

        cy.get(`${this.settlement_Payment_AddBtn}:visible`).click();
        cy.wait(500);
        dialog.confirmDialog();
        dialog.verifyTitle("Create New PL-Only Payment");
        cy.waitForPopUpDisappeared();
        // Fill in the details
        for (let key in notEmptyValueObject) {
            dialog.enterValue(key, notEmptyValueObject[key]);
        }
        dialog.inputValueForTextArea("Create a new PL Payment");
        // dialog.save();
        dialog.clickButton("Save");
        dialog.confirmDialog();
        dialog.confirmDialog(); // For Duplicated Payment
        // cy.wait(1000);
        cy.verifyPopUp("Payment has been created successfully");
        this.waitForProcessCompleted();
    }

    clickChangeReservesButton() {
        cy.intercept('GET', '**?plugin=GetReserves*').as('getReserves');
        // cy.intercept('GET', '**GET*systemcodes*currencies*').as('getCurrencies');
        cy.get(`${this.changeReservesButtonSelector}:visible`).click().wait(1000).then(() => {
            if (Cypress.$(this.confirmDialogSelector).length) {
                Cypress.$("button[type][title='Yes']").click();
            };
        });
        cy.waitForRequest("getReserves");
        // cy.waitForRequest("getCurrencies");
    }

    clickAddPaymentButton(paymentType) {
        cy.get(`button[aria-controls='claim-process-payment']:visible:contains('${paymentType}')`)
            .click().wait(1000).then(() => {
                if (Cypress.$(this.confirmDialogSelector).length) {
                    Cypress.$("button[type][title='Yes']").click();
                };
            });
        cy.waitForPopUpDisappeared();
        cy.waitForPageLoaded();
    }

}