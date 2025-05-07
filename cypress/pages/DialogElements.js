import { ResultTable } from "../pages/ResultTable";
import { SearchForm } from "../pages/SearchForm";
import { CommonElements } from "./CommonElements";
import { RightInformationPanel } from "./RightInformationPanel";

const table = new ResultTable();
const searchForm = new SearchForm();
const commonElements = new CommonElements();
const rightPanel = new RightInformationPanel();

export class DialogElements {
    /** 
     * @description: The main overlay popUp which always is present in TREE and will be 
     *  div[class='cdk-overlay-container'] will contain one of following sub-child elements 
     *  - If there is WARNING dialog 
     *      --> nv-warning-dialog > section[class^='dialog']
     *  - No WARNING dialog
     *      --> form > section[class^='dialog']
     */
    // Will update all elements from this selector
    cdkOverlayContainerSelector = "div[class='cdk-overlay-container']";
    childDiv = "div[id^='ngdialog']";
    warningDialogSelector = "nv-warning-dialog";
    formDialogSelector = "div.dialog-content-form-tab";
    // dialogSectionSelector = "section[class^='dialog view-port']";
    // dialogSectionSelector = "section[class*='view-port']";
    // dialogSectionSelector = "section[class*='dialog']";
    //dialogSectionSelector = "section[class^='dialog']";// Not working with 2 opened dialog
    dialogViewPortSelector = "section[class^='dialog']"; //--> working almost cases
    //--> Broker - Objects - Mortgagees - Cargo PA-15822 - Broker - Cargo-type Object - Add Mortgagee

    dialogSectionSelector = "div[role='document']"; //--> Error at Broker - Offer Adv Search
    // warningDialogSelector children
    closeButton = "button[class$='btn-default']";
    confirmButton = "button[class$='btn-primary']";
    titleDialogTxT = "header h3";
    titleValueDialogTxT = "header h3 pre";

    titleDialogHeaderTxtH4 = "header h4";
    titleTxtTabH2 = "h2[class='ng-binding']"
    extraInfoTitleDialogTxT = "header > div"; // Update for code change from 19/08/2024


    // Offer -> Product Summary
    ourShareTxT = "div.summary-number > strong"; //[ng-bind=\"$ctrl.product.get('OurShare')\"]
    offerStatusTxT = "[data-ng-if*=\"$ctrl.product.get('Ready')\"]";


    dialogLoadingSelector = "div[class='page-loading']";

    /**********************************/
    // Dialog 
    //dialogViewPortSelector = "*[class^='dialog']"; 
    //[class*='dialog view-port'] 
    //section[class^='dialog']
    //dialogViewPortSelector = "section[class^='dialog view-port']"; 
    //"section[class^='dialog']"; 
    //section[class^='dialog dialog']
    //section[class^='dialog dialog'] 

    ndDialogContentSelector = "div[class^='ngdialog-content']";

    checkboxSelector = "input[type='checkbox']";
    radioBoxSelector = "input[type='radio']";
    selectSelector = "input[type='select-multiple']";
    buttonSelector = "button[type]";
    inputTextSelector = "input[type]"; //"input[type='text']";
    confirmDialogSelector = "div[role='alertdialog']"; //[class*='dialog view-port']

    dSelectDropdown = "div[class='selectize-dropdown-content']"
    optionValues = "div[class='selectize-dropdown-content'] div[class^='option']"
    magnifierIcon = "i[class$='advance-search-icon']";

    // Confirmation Dialog
    confirmationDialogSelector = "section[class$='ddb-confirm']";
    headingSelector = "header h3";

    // Tab
    tabNavSelector = "ul[class*='tab-add-more tab-slider']"

    // Edit Columns
    // displayedColumnSelector = "ul[class='column-dragdrop'] li div[ng-bind='column.title']";
    displayedColumnSelector = "div[class='columns-list list-right'] div[class='vbox'] div[class='column-dragdrop'] div[class^='column-dragdrop-item'] nv-inline-checkbox";
    searchTextDisplayedColumnSelector = "div[class='columns-list list-right'] input[placeholder='Search']";
    selectAllDisplayedColumnSelector = "div[class='columns-list list-right'] div[class='row column-search'] nv-inline-checkbox";
    // availableColumnSelector = "ul:not([class]) li div[ng-bind='column.title']";
    availableDisplayedColumnSelector = "div[class='columns-list list-right'] div[class='vbox'] div[class='column-dragdrop'] div[class^='column-dragdrop-item']";
    availableColumnSelector = "div[class='columns-list list-left'] div[class='vbox'] div[class='nv-inline-checkbox']";
    searchTextAvailableColumnSelector = "div[class='columns-list list-left'] input[placeholder='Search']";
    removeColumnButton = "div[class^='list-arrows'] > nv-button[icon$='angle-left'] > button";
    addColumnButton = "div[class^='list-arrows'] > nv-button[icon$='angle-right'] > button";

    // Result Table
    tableSection = {
        selector: "table[class^='table table-hover']",
        headerSelector: "table[class^='table table-hover'] thead tr th",
        // rowSelector: "tbody tr[role='row']",
        rowSelector: "tr[role='row']",
        cellSelector: "td",
        buttonSelector: "button[type='button']",
        claimLeadSelector: "input[type='select-multiple'][placeholder$='Claim Lead']",
        claimLeadOptionValues: "div[class='selectize-dropdown-content'] div[class^='option']"
    }

    // Close button
    closeBtn = "button[class='ngdialog-close']";

    legalPersonSelector = "d-select[id*='Person'] input[type='select-multiple']";
    textAreaSelector = "textarea"



    //Coverage Information section
    coverageInforSelector = "div[class^='coverage-info']"
    inforHeaderSelector = "dt"
    inforValueSelector = "dd"

    tooltipValidationField = "div[class*='tooltip-validation']"
    requiredFieldAlert = "nv-tooltip-wrapper" // "i[class*='exclamation']"

    ourShareInput = "input[id$='OurShare']";
    // Offer -> Overview Diagram
    nodeSelector = "g[class^='node lv']";
    titleNode = "[class^='textTitle']";
    contentNode = "[class='textContent']";
    statusNode = "[class='textStatus']";

    // Context menu
    contextMenuSelector = "nv-action-menu";
    contextMenuOptions = "nv-menu-item > button";

    // Tree component
    searchInputSelector = "input[class^='form-control']";
    commonCodeSelector = "span[class^='nv-tree-node-label']";

    // Other
    filterTextBox = "input[type='search']";
    removeButtonSelector = "button > i.fa.fa-times";

    notesTasksSelector = "[class^='notes-tasks']";
    pencilIconSelector = "i[class='fas fa-pencil-alt']";

    // Filter
    filterFieldSection = "div[class='row']";
    filterField = "strong";
    doneDateForNoteTask = "date-picker input[id*='DoneDate']";
    categoryForNoteTask = "d-select[name*='.Category']";
    handlerForNoteTask = "div > input[name*='.ToSignature']";

    multiDropdownlist_inputField = "nv-dropdown-panel input[role='combobox']";
    multiDropdownlist_optionField = "nv-dropdown-option nv-default-drop-down-option";
    /**
     * @description [Specific case] is used to verify Our Share Value from 
     * Offer -> Product -> Summary
     * @param {*} share value need to verify 
     */
    verifyOurShare(share) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).then(dialogSection => {
                cy.wrap(dialogSection).find("label").contains("Our Share").parent().within(() => {
                    cy.get(this.ourShareTxT).invoke('text').then((text) => {
                        expect(text).to.contains(share);
                    });
                });
            });
        });
    }

    waitForDialogLoaded() {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).then(dialogSection => {
                if (dialogSection.find(this.dialogLoadingSelector).length) {
                    cy.log("Waiting for Dialog loaded ...");
                    cy.wait(1000);
                    this.waitForDialogLoaded();
                }
            });
        });
    }

    /**
     * @description [Specific case] is used to select Claim Lead from 
     * Offer -> Product -> Insured Object tab
     * @param {*} value value need to select
     */
    inputClaimLead(value) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().scrollIntoView().within(() => {
            cy.get(this.tableSection.selector).should("be.visible").within((table) => {
                cy.get(this.tableSection.claimLeadSelector).click().type(value);
                cy.wait(1000);
                cy.root().parents('body').find(`${this.tableSection.claimLeadOptionValues}:visible`)
                    .first().click();
            });
        });
    }

    selectValue(label, value) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).first().within(() => {
                cy.selectValue(label, value);
            });
        });
    }

    selectValueByPlaceHolder(label, value) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).first().within(() => {
                cy.selectValueByPlaceHolder(label, value);
            });
        });
    }

    clickMagnifierIcon(label) {
        cy.get(`${this.dialogViewPortSelector}:visible`).scrollIntoView().within(() => {
            cy.get(`[placeholder$='${label}']`).then((ele) => {
                return ele.get(0);
            }).then((id) => {
                cy.get(id).find(this.magnifierIcon).click();
            })
        });
    }

    clickButton(label) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).then((dialogSection) => {
                cy.wrap(dialogSection).find(`${this.buttonSelector}:visible:not(:disabled)`)
                    .contains(new RegExp("^" + label + "$", "g")).click();
                if (label.toLowerCase() === "search" || label.toLowerCase() === "reset")
                    searchForm.waitForSearchCompleted();
            });
        });
        cy.wait(500);
    }

    /**
     * @description: is used to click "Save" btn on Dialog section for saving the action.
     */
    save(counter = 0, trigger = false) {
        cy.get("body").then((body) => {
            if (body.find(this.cdkOverlayContainerSelector).find(this.dialogViewPortSelector).length > 0
                && trigger == false) {
                cy.wrap(body.find(this.cdkOverlayContainerSelector).find(this.dialogViewPortSelector))
                    .find(`${this.buttonSelector}:visible`).contains("save", { matchCase: false })
                    .then($save => {
                        if (!$save.is(":disabled") && $save.text().includes("Save") && counter < 3) {
                            cy.wrap($save).click();
                            cy.wait(1000);
                            cy.log("Saving ... ...");
                            counter = counter + 1;
                            this.save(counter, true);
                        }
                        if ($save.is(":disabled") && $save.text().includes("Save")) {
                            assert.fail("Save button is disabled!");
                        }
                    });
            }
            if (body.find(this.cdkOverlayContainerSelector).find(this.dialogViewPortSelector).length > 0
                && trigger == true && counter < 5) {
                cy.log("Waiting for Save completed...");
                cy.wait(500);
                counter = counter + 1;
                this.save(counter, true);
            }
        });
    }

    clickLink(label) {
        cy.get(`${this.dialogViewPortSelector}:visible`).should("be.visible").first().within((viewPort) => {
            cy.get("a").then((links) => {
                const noOfA = links.length;
                for (let index = 0; index < noOfA; index++) {
                    if (links.get(index).hasAttribute("title")) {
                        const title = links.get(index).getAttribute("title").trim();
                        if (title === label) {
                            return links.get(index);
                        }
                    } else {
                        if (links.get(index).text.match(label)) {
                            return links.get(index);
                        }
                    }
                }
            }).then((sle) => {
                cy.get(sle).contains(label).click();
            });
        });
        cy.wait(500);
        cy.waitForPageLoaded();
    }

    clickTab(label) {
        cy.get(`${this.dialogViewPortSelector}:visible`).should("be.visible").first().within(() => {
            cy.get(`${commonElements.nvTabs}:visible`)
                .should("be.visible").first().within((tabs) => {
                    cy.get(tabs).contains(`${label}`).click();
                });
        });
        cy.wait(500);
        cy.waitForPageLoaded();
    }

    inputValue(label, value) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).first().within(() => {
                cy.inputValue(label, value);
            });
        });
        cy.wait(500);
    }

    inputOurShare(value) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.get(this.ourShareInput).clear().type(value);
        });
    }

    verifyInputtedOurShare(value) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.get(this.ourShareInput).invoke("val").should("contain", value);
        });
    }

    verifyInputtedValue(label, value) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.verifyInputtedValue(label, value);
        });
        cy.wait(500);
    }

    verifySelectedValue(label, value) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.verifySelectedValue(label, value);
        });
        cy.wait(500);
    }

    searchValue(label, text) {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            cy.get(`${this.inputTextSelector}[placeholder$='${label}']:visible`)
                .type(`{backspace}${text}{enter}`);
        });
        cy.wait(500);
    }

    checkCheckbox(label) {
        cy.get(`${this.dialogViewPortSelector}:visible`).then(() => {
            cy.checkCheckbox(label);
        });
        cy.wait(500);
    }

    unCheckCheckbox(label) {
        cy.get(`${this.dialogViewPortSelector}:visible`).then(() => {
            cy.unCheckCheckbox(label);
        });
        cy.wait(500);
    }

    checkRadioButton(label, value) {
        cy.get(`${this.dialogViewPortSelector}:visible`).last().within(($dialog) => {
            cy.wait(1500);
            cy.get(`${this.radioBoxSelector}[placeholder*='${label}']`).each((item, index, list) => {
                if (item.parent("div").find("label").text() === value) {
                    cy.wrap(item).click({ force: true });
                    return false;
                }
            });
        });

    }

    addMoreTab() {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(($dialog) => {
            cy.get(`${this.buttonSelector}[data-ng-if*='addMore']`)
                .first().click();
        });
        cy.waitForPageLoaded();
    }

    // NO Use
    returnTabElement(tabLabel) {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(($dialog) => {
            cy.get(`${this.tabNavSelector}`).find("li").then((lis) => {
                console.log("Element: ", lis)
                console.log("TypeOf: ", typeof lis)
                const noOfLi = lis.length;
                console.log("Length :", noOfLi)
                for (let index = 0; index < noOfLi; index++) {
                    console.log("------------ inside FOR loop ----------")
                    console.log("Index :", index)
                    console.log("Element @ index :", lis[index])
                    // return aTag as HTMLCollection
                    let aTag = lis[index].getElementsByTagName("a");
                    console.log("Element a:", aTag);
                    console.log("TypeOf a:", typeof aTag);
                    let title = aTag[0].getAttribute("title");
                    console.log("Title of a: ", title)
                    if (title.includes(tabLabel)) {
                        console.log(`Found Index = ${index}`);
                        console.log(`Found Element: ${aTag}`)
                        console.log(`Return Title: ${title}`)
                        // return aTag;
                        return title;
                    }
                }
            })
        })
    }

    verifyTab(tabLabel) {
        cy.get(`${this.tabNavSelector}:visible`).within((viewPort) => {
            cy.get("li a").invoke("text").then((text) => {
                expect(text).to.be.contains(tabLabel);
            })
        });
    }

    removeTab(tabLabel) {
        cy.get(`${this.dialogViewPortSelector}:visible`).within((viewPort) => {
            cy.get(`a[title$='${tabLabel}']:visible`)
                .find("span").last().click();
        });
        cy.confirmDialog();
        cy.waitForPageLoaded();
    }

    /**
     * @description is used to verify title of dialog
     * @param {*} value Title of Dialog to verify
     */
    verifyTitle_bk(value) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).then(dialogSection => {
                cy.wrap(dialogSection).find(`${this.titleDialogTxT}:visible`).wait(2000)
                    .invoke('text').then((text) => {
                        if (text.includes("undefined")) {
                            this.verifyTitle(value);
                        } else {
                            expect(text.trim().toUpperCase()).to.contains(value.toUpperCase());
                        }
                    });
            });
        });
    }

    verifyTitleHeaderH4(value) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).then(dialogSection => {
                cy.wrap(dialogSection).find(`${this.titleDialogHeaderTxtH4}:visible`).wait(2000)
                    .invoke('text').then((text) => {
                        if (text.includes("undefined")) {
                            this.verifyTitle(value);
                        } else {
                            expect(text.trim().toUpperCase()).to.contains(value.toUpperCase());
                        }
                    });
            });
        });
    }

    verifyTitleTabH2(value) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).then(dialogSection => {
                cy.wrap(dialogSection).find(`${this.titleTxtTabH2}:visible`).wait(2000)
                    .invoke('text').then((text) => {
                        if (text.includes("undefined")) {
                            this.verifyTitle(value);
                        } else {
                            expect(text.trim().toUpperCase()).to.contains(value.toUpperCase());
                        }
                    });
            });
        });
    }

    verifyTitle(value) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).first().within(dialogSection => {
                cy.wrap(dialogSection).find("header:visible").wait(2000)
                    .invoke('text').then((text) => {
                        if (text.includes("undefined")) {
                            this.verifyTitle(value);
                        } else {
                            let headerElement = dialogSection.find("header:first");
                            let childElement = headerElement.children().get(0);
                            expect(childElement.textContent.trim().toUpperCase()).to.contains(value.toUpperCase());
                        }
                    });
            });
        });
    }

    /**
     * @description is used to verify title value of dialog
     * @param {*} value Title value of Dialog to verify
     */
    verifyTitleValue(value) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).then(dialogSection => {
                cy.wrap(dialogSection).find(`${this.titleValueDialogTxT}`)
                    .invoke('text').then((text) => {
                        expect(text.trim().toUpperCase()).to.equal(value.toUpperCase());
                    });
            });
        });
    }

    /**
     * @description is used to verify title value of Product dialog
     * @param {*} value Title value of Product Dialog to verify
     */
    verifyProductTitle(value) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).then(dialogSection => {
                cy.wrap(dialogSection).find(`${this.extraInfoTitleDialogTxT}`)
                    .invoke('text').then((text) => {
                        expect(text.trim().toUpperCase()).to.contains(value.toUpperCase());
                    });
            });
        });
    }

    discardChange() {
        cy.get(`${this.confirmDialogSelector}:visible`).within((viewPort) => {
            cy.get(this.confirmButton).click();
            cy.wait(2000);
        });
    }

    removeColumns(...columnNames) {
        cy.intercept('POST', '**?plugin=SaveUserConfig*').as('applyTableSettings');
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            columnNames.forEach(col => {
                cy.get(`${this.searchTextDisplayedColumnSelector}`).clear().type(col);
                cy.wait(200);
                cy.get(`${this.displayedColumnSelector}:visible`).contains(col, { matchCase: false }).click();
                cy.get(this.removeColumnButton).click();
                cy.wait(200);
            });
        });
        this.clickButton("Apply");
        cy.wait('@applyTableSettings').its('response.statusCode').should('eq', 200);
        cy.wait(1000);
    }

    removeColumnsAndCancel(...columnNames) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(($dialog) => {
            columnNames.forEach(col => {
                cy.get(`${this.searchTextDisplayedColumnSelector}`).clear().type(col);
                cy.wait(200);
                cy.get(`${this.displayedColumnSelector}:visible`).contains(col, { matchCase: false }).click();
                cy.get(this.removeColumnButton).click();
                cy.wait(200);
            });
        });
        this.clickButton("Close");
    }

    addColumns(...columnNames) {
        cy.intercept('POST', '**?plugin=SaveUserConfig*').as('applyTableSettings');
        cy.get(`${this.dialogViewPortSelector}:visible`).first().then(() => {
            columnNames.forEach(col => {
                cy.get(`${this.searchTextAvailableColumnSelector}`).clear().type(col);
                cy.wait(200);
                cy.get(`${this.availableColumnSelector}:visible`).contains(new RegExp("^" + col + "$", "g")).click();
                cy.get(this.addColumnButton).click();
                cy.wait(200);
            });
        });
        this.clickButton("Apply");
        cy.wait('@applyTableSettings').its('response.statusCode').should('eq', 200);
        cy.wait(1000);
    }

    addColumnsAndCancel(...columnNames) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().then(($dialog) => {
            columnNames.forEach(col => {
                cy.get(`${this.searchTextAvailableColumnSelector}`).clear().type(col);
                cy.wait(200);
                cy.get(`${this.availableColumnSelector}:visible`).contains(new RegExp("^" + col + "$", "g")).click();
                cy.get(this.addColumnButton).click();
                cy.wait(200);
            });
        });
        this.clickButton("Close");
    }

    /**
     * @description: Adding default columns for Claim Page
     */
    addDefaultColumns() {
        let trigger = false;
        let defaultColumns = ["Claim ID", "Claim text", "Object", "Original Insured", "Claim Handler", "Interest", "Claim Date", "Reserve", "Currency", "Status"];
        let beingAddedColumns = [];
        cy.get(this.dialogViewPortSelector).first().should("be.visible").then(() => {
            // First wait for the available columns displayed
            cy.get(this.availableDisplayedColumnSelector).should("be.visible").then((items) => {
                cy.wrap(items).find("label").each((label) => {
                    beingAddedColumns.push(label.text().trim());
                }).then(() => {
                    console.log(beingAddedColumns);
                    if (beingAddedColumns.toString() !== defaultColumns.toString()) {
                        trigger = true;
                        // Then remove all available columns
                        cy.get(`${this.selectAllDisplayedColumnSelector}:visible`).click();
                        cy.get(this.removeColumnButton).click();
                        // Then add default columns
                        this.addColumns("Claim ID", "Claim text", "Object", "Original Insured", "Claim Handler", "Interest", "Claim Date", "Status");
                    } else {
                        this.clickButton("Close");
                    }
                });

            });
        });
    }

    verifySearchCriteria(label, text) {
        cy.get(`${this.dialogViewPortSelector}:visible`).scrollIntoView().within((viewPort) => {
            cy.get(`${searchForm.searchFormSection.searchHashTag} div[title='${label}'] > span`).then(($span) => {
                $span.css("color", "red");
                const actualText = $span.text().trim();
                expect(actualText.toUpperCase()).to.be.contain(text.toUpperCase());
            });
        });
    }

    removeSearchCriteria(label) {
        cy.get(`${this.dialogViewPortSelector}:visible`).scrollIntoView().within((viewPort) => {
            cy.get(`div[title='${label}'] span[class='hashtag-remove']`).click();
        });
        cy.waitForPageLoaded();
    }

    /**
     * Recursive function to remove the search criteria
     * [UPDATED] use JQUERY command to avoid the CPU crash issue
     */
    removeAllSearchCriteria() {
        cy.log("Remove All Search Criteria");
        cy.waitForPageLoaded();
        cy.get(`${this.dialogViewPortSelector}:visible`).within((viewPort) => {
            let tagCounter = viewPort.find(searchForm.searchFormSection.removeSearchHashTag).length;
            if (tagCounter > 0) {
                for (let index = 1; index <= tagCounter; index++) {
                    let tagIndex = tagCounter - index;
                    viewPort.find(searchForm.searchFormSection.removeSearchHashTag).eq(tagIndex).click();
                }
            }
        });
        cy.wait(1000);
        cy.log("Remove All Search Criteria");
    }

    // Currently used for 
    selectMultipleValue(label, value) {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            cy.get(`[placeholder$='${label}']`).click();
            cy.log(`Click on ${label} input`);
        });
        cy.wait(500);
        cy.get(commonElements.nvDropdownPanel).within(() => {
            cy.get(`${commonElements.nvDropdownPanel_searchTxt}:visible`).type(value);
            cy.wait(500);
            cy.get(`${commonElements.nvDropdownPanel_options} ${commonElements.nvDropdownPanel_options_label}:visible`)
                .contains(value).click({ force: true });
            cy.get(`${commonElements.nvDropdownPanel_searchTxt}:visible`).tab();
        });
    }

    waitForResultTableLoaded() {
        cy.get(`${this.dialogViewPortSelector}:visible`).last().scrollIntoView().within(() => {
            table.waitForResultTableLoaded();
        });
    }

    verifyTextInResultTable(text) {
        this.waitForResultTableLoaded();
        cy.get(`${this.dialogViewPortSelector}:visible`).scrollIntoView().within((viewPort) => {
            cy.get(`${this.tableSection.selector}:visible`).within((table) => {
                cy.get("tbody tr > td > span").contains(text);
            });
        });
    }

    /**
     * @description Verify Specific Row's value (Title of icon/pic) based on Colum Header and Row Value of its Header in Table
     * @param {String} sourceHeader - Column Header
     * @param {String} sourceValue - Value of Row on sourceHeader
     * @param {String} searchHeader - Column Header of Target Header which will check the data with following row's value (searchValue)
     * @param {String} searchValue - Row's value (Title of icon/pic) need to verify on Target Column and Target Row
     */
    verifyNonTextRowBasedOnColumHeaderAndRow(sourceHeader, sourceValue, searchHeader, searchValue) {
        cy.get(`${this.dialogViewPortSelector}:visible`).scrollIntoView().within(() => {
            table.verifyNonTextRowBasedOnColumHeaderAndRow(sourceHeader, sourceValue, searchHeader, searchValue);
        });
    }

    /**
     * consider to change the function to verifyRowBasedOnColumHeaderAndRow()
     * @description Verify Specific Row's Value (Text) based on Colum Header and Row Value of its Header in Table
     * @param {String} sourceHeader - Column Header
     * @param {String} sourceValue - Value of Row on sourceHeader
     * @param {String} searchHeader - Column Header of Target Header which will check the data with following row's value (searchValue)
     * @param {String} searchValue - Row's value need to verify on Target Column and Target Row
     */
    verifyRowBasedOnColumHeaderAndRow(sourceHeader, sourceValue, searchHeader, searchValue) {
        cy.get(`${this.dialogViewPortSelector}:visible`).last().scrollIntoView().within(() => {
            table.verifyRowBasedOnColumHeaderAndRow(sourceHeader, sourceValue, searchHeader, searchValue);
        });
    }

    /**
     * @description Input Specific Row's Value (Text) based on Colum Header and Row Value of its Header in Table
     * @param {String} sourceHeader - Column Header
     * @param {String} sourceValue - Value of Row on sourceHeader
     * @param {String} searchHeader - Column Header of Target Header which will check the data with following row's value (searchValue)
     * @param {String} value - Row's value need to verify on Target Column and Target Row
     */
    inputRowValueBasedOnColumHeaderAndRow(sourceHeader, sourceValue, searchHeader, value) {
        cy.get(this.cdkOverlayContainerSelector).within(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).within(() => {
                table.inputRowValueBasedOnColumHeaderAndRow(sourceHeader, sourceValue, searchHeader, value);
            });
        });
    }

    /**
     * Change the function name to verifyAllRowsBasedOnColumHeader() from verifyColumnInResultTable()
     * @description Verify ALL Row's Value (Text) based on Colum Header in Table
     * @param {String} colHeader - Column Header
     * @param {String} sourceValue - Value of all Rows
     */
    verifyAllRowsBasedOnColumHeader(columnHeader, searchText) {
        cy.wait(1000);
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            table.verifyAllRowsBasedOnColumHeader(columnHeader, searchText);
        });
    }

    /**
     * @description Verify Row's Value (Text) (at least 1 row) based on Colum Header in Table
     * @param {String} colHeader - Column Header
     * @param {String} sourceValue - Value of Row
     */
    verifyRowBasedOnColumHeader(columnHeader, searchText) {
        cy.wait(1000);
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            table.verifyRowBasedOnColumHeader(columnHeader, searchText);
        });
    }

    checkRowValueIsAvailableBasedOnColumHeader(columnHeader, searchText) {
        cy.wait(1000);
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            table.checkRowValueIsAvailableBasedOnColumHeader(columnHeader, searchText);
        });
    }

    /**
     * @description Click Row's Value (Text) based on Colum Header and Value of Row in Table
     * @param {String} colHeader - Column Header
     * @param {String} sourceValue - Value of Row
     */
    clickOnRowBasedOn(columnHeader, searchText) {
        cy.wait(1000);
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            table.clickOnRowBasedOn(columnHeader, searchText);
        });
        cy.waitForPageLoaded();
    }

    verifyNonTextColumnInResultTable(fieldLabel, searchText) {
        cy.wait(1000);
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            table.verifyNonTextColumnInResultTable(fieldLabel, searchText);
        });
    }

    checkCheckBoxBasedOnRowInTable(sourceHeader, sourceValue, checkBoxColumn) {
        cy.get(`${this.dialogViewPortSelector}:visible`).scrollIntoView().within(() => {
            table.checkCheckBoxBasedOnRowInTable(sourceHeader, sourceValue, checkBoxColumn);
        });
    }

    /**
     * @description click the only button on ROW based on Column Header and Row Value
     * @param {String} colHeader - Column Header
     * @param {String} sourceValue - Value of Row
     */
    clickButtonOnLastColumnBasedOn(sourceHeader, sourceValue, action = "View") {
        cy.get(`${this.dialogViewPortSelector}:visible`).scrollIntoView().within(() => {
            table.clickButtonOnLastColumnBasedOn(sourceHeader, sourceValue, action);
        });
        if (action !== "Select")
            cy.waitForPageLoaded();
    }

    inputValuesInTable(headerName, value) {
        cy.wait(1000);
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            table.inputValuesInTable(headerName, value);
        });
    }

    inputValueForLastRowInTable(headerName, value) {
        cy.wait(1000);
        cy.get(`${this.dialogSectionSelector}:visible`).within(() => {
            table.inputValueForLastRowInTable(headerName, value);
        });
    }

    inputValueForFirstRowInTable(headerName, value) {
        cy.wait(1000);
        cy.get(`${this.dialogSectionSelector}:visible`).within(() => {
            table.inputValueForFirstRowInTable(headerName, value);
        });
    }

    verifyLabelExist(label) {
        cy.wait(1000);
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            cy.get("label > span:visible").then($span => {
                for (let index = 0; index < $span.length; index++) {
                    const spanElement = $span[index];
                    console.log(`Index: ${index}`);
                    if (spanElement.innerText.trim().toUpperCase() === label.toUpperCase()) {
                        console.log(`Inside Index: ${index}`);
                        expect(spanElement.innerText.trim().toUpperCase()).to.be.equal(label.toUpperCase());
                        return false;
                    }
                }
            });
        });
    }

    verifyTableHeaderExisted(header) {
        cy.wait(1000);
        cy.get(`${this.dialogViewPortSelector}:visible`).scrollIntoView().within(() => {
            table.verifyHeaderExisted(header);
        });
    }

    verifyTableHeaderNotExisted(header) {
        cy.wait(1000);
        cy.get(`${this.dialogViewPortSelector}:visible`).scrollIntoView().within(() => {
            table.verifyHeaderNotExisted(header);
        });
    }

    selectLegalPerson(name) {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            cy.get(`${this.legalPersonSelector}:visible`).type(name);
            cy.wait(1000);
        });
        cy.get(`${this.dSelectDropdown}:visible`).contains(name).click();
        cy.wait(500);
    }

    inputValueForTextArea(value) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).first().within(() => {
                cy.get(`${this.textAreaSelector}`).clear().type(value).wait(500);
            });
        });
    }

    inputTextEditor(label, value) {
        cy.get(`${this.dialogViewPortSelector}:visible`).last().within(() => {
            cy.inputTextEditor(label, value);
        });
    }

    verifyInputtedTextArea(text) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.get(`${this.textAreaSelector}:visible`).then(value => {
                let textValue = value.val();
                expect(textValue).to.be.equal(text);
            });
        });
    }

    verifyInputtedTextEditor(label, text) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.verifyInputtedTextEditor(label, text);
        });
    }

    /**
     * @description used to input or select value if you're not sure about the element type (INPUT or SELECT tag)
     * @param {string} label 
     * @param {string} value 
     */
    enterValue(label, value) {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            // Getting label with matched text
            cy.get("label > span:visible").contains(new RegExp("^" + label + "$", "g"))
                .then(($element) => {
                    let childrenElement = $element.parent("label")
                        .parent("div")
                        .find(":not(div):not(label):not(span)").get();
                    console.log(`getElementTagByLabel of ${label}: ${childrenElement}`);
                    console.log(childrenElement);
                    let newArray = [];
                    childrenElement.forEach(
                        element => newArray.push(element.nodeName)
                    );
                    return newArray.toString();
                }).then(tagList => {
                    tagList.includes("SELECT")
                        ? cy.selectValue(label, value)
                        : cy.inputValue(label, value);
                });
        });
    }

    verifyCoverageInformation(header, value, envValue = "noriaDev") {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            cy.get(this.coverageInforSelector).within(() => {
                cy.get(`div > dl > ${this.inforHeaderSelector}:visible`).then((headerElement) => {
                    console.log(`Length: ${headerElement.length}`);
                    for (let index = 0; index < headerElement.length; index++) {
                        let headerText = headerElement[index].innerText.trim().replace(" ", "");
                        if (headerText.endsWith(header.replace(" ", ""))) {
                            let node = headerElement[index];
                            if (!envValue.includes("gard") && !envValue.includes("codan")) {
                                return node.nextSibling;
                            }
                            if (node.nextSibling.nodeName !== "DD") {
                                return node.nextSibling.nextSibling;
                            }
                            return node.nextSibling;
                        }
                    }
                }).then((element) => {
                    cy.wrap(element).invoke("text").then(text => {
                        expect(text.trim().toUpperCase()).to.contain(value.toUpperCase());
                    });
                });
            });
        });
    }

    /**
     * @description click on TEXT in Table from Dialog popUp
     * @param {string} text 
     */
    //Not Used Yet, consider to remove, use clickOnRowBasedOn(colHeader, text) instead.
    clickSpecificRow(text) {
        cy.get(`${this.dialogViewPortSelector}:visible`).scrollIntoView().within(() => {
            table.clickSpecificRow(text);
        });
    }

    /**
     * Using Jquery to query the element for deleting Filter (bit faster than deletePredefinedFilter func )
     * @param {String} name 
     */
    deleteFilter(name) {
        cy.get(this.cdkOverlayContainerSelector).within(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).within(() => {
                cy.get(this.tableSection.selector).then((table) => {
                    const $col = table.find(`td:contains('${name}')`);
                    const $row = $col.parent("tr");
                    const $trashIcon = $row.find("td button > i[class*='trash']");
                    $trashIcon.click();
                });
                cy.get(`${this.confirmButton}:visible`).click();
            });
        });
        cy.wait(1000);
    }

    deletePredefinedFilter(rowValue) {
        const colHeader = "NAME";
        let rowIndex = 5; // out of range number
        cy.get(`${this.dialogViewPortSelector}:visible`).first().scrollIntoView().within(() => {
            cy.get(`${this.tableSection.selector}:visible`).first().within(() => {
                cy.get("thead").contains("th", colHeader, { matchCase: false }).invoke("index")
                    .then((sourceCol) => {
                        cy.get("tbody > tr").then(($rowElement) => {
                            cy.log("Row length: ", $rowElement.length);
                            for (let index = 0; index < $rowElement.length; index++) {
                                cy.wrap($rowElement).eq(index).find("td").eq(sourceCol).find("span").invoke("text")
                                    .then((text) => {
                                        if (text.toLowerCase() === rowValue.toLowerCase()) {
                                            rowIndex = index;
                                            console.log("New rowIndex value: ", rowIndex);
                                            return false;
                                        }
                                    });
                            }
                        });
                    });

                cy.get("thead").get("th:visible").last().then(() => {
                    if (rowIndex !== 5) {
                        cy.get("tbody > tr").eq(rowIndex).then(($destinationCell) => {
                            cy.wrap($destinationCell).find("td").find("button > i[class*='trash']").click();
                        });
                        cy.wrap(Cypress.$("body")).find(this.confirmButton).click();
                    }
                });

            });
        });
    }

    editFilter(name) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).then(() => {
                cy.get(this.tableSection.selector).then((table) => {
                    const $col = table.find(`td:contains('${name}')`);
                    const $row = $col.parent("tr");
                    const $trashIcon = $row.find("td button > i[class*='pencil']");
                    $trashIcon.click();
                });
            });
        });
        cy.wait(300);
        cy.waitForPageLoaded();
    }

    editPredefinedFilter(rowValue) {
        const colHeader = "NAME";
        let rowIndex = 0;
        cy.get(`${this.dialogViewPortSelector}:visible`).first().scrollIntoView().within(() => {
            cy.get(`${this.tableSection.selector}:visible`).first().within(() => {
                cy.get("thead").contains("th", colHeader, { matchCase: false }).invoke("index")
                    .then((sourceCol) => {
                        cy.get("tbody > tr").then(($rowElement) => {
                            for (let index = 0; index < $rowElement.length; index++) {
                                cy.wrap($rowElement).eq(index).find("td").eq(sourceCol).find("span").invoke("text")
                                    .then((text) => {
                                        if (text.toLowerCase() === rowValue.toLowerCase()) {
                                            rowIndex = index;
                                            return false;
                                        }
                                    });
                            }
                        });
                    });
                cy.get("thead").get("th:visible").last()
                    .then(() => {
                        cy.get("tbody > tr").eq(rowIndex).then(($destinationCell) => {
                            cy.wrap($destinationCell).find("td").find("button > i[class*='pencil']").click();
                        });
                    });
            });

        });
        cy.waitForPageLoaded();
    }

    clearSelectedValue(label) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.clearSelectedValue(label);
        });
    }

    verifyMissingRequiredField() {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.get(`${this.tooltipValidationField}:visible`).first().within((field) => {
                assert.isTrue(field.has(this.requiredFieldAlert).length > 0, "Missing required fields, please check again!");
            });
        });
    }

    verifyRequiredField() {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.get(this.tooltipValidationField).then((field) => {
                assert.isTrue(field.has(this.requiredFieldAlert).length === 0, "Required fields are inputted!");
            });
        });
    }

    inputValue2ndReferenceInvoice(placeholderText, value) {
        cy.get(`${this.dialogViewPortSelector}`).first().within(() => {
            cy.get(`input[type][placeholder$='${placeholderText}']:visible`)
                .then($input => $input.get(1).setAttribute("value", value))
        });
        cy.wait(500);
    }

    inputValue3rdReferenceInvoice(placeholderText, value) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.get(`input[type][placeholder$='${placeholderText}']:visible`)
                .last().type(value);
        });
        cy.wait(500);
    }

    closeLegalPersonDetailsPopUp() {
        cy.get(`${this.ndDialogContentSelector}`).first().within(() => {
            cy.get(`${this.buttonSelector}:visible`).contains("Close").click();
        });
        cy.wait(500);
    }

    clickAddObject() {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.get("button[title='Select']:visible").first().click({ force: true });
        });
        cy.wait(1000);
        cy.waitForPageLoaded();
    }

    verifyNodeValueFromDiagram(nodeNth = 1, title, content, status) {
        cy.get(this.nodeSelector).then(nodes => {
            let indexNode = nodes.length - nodeNth;
            cy.get(this.nodeSelector).eq(indexNode).within(node => {
                cy.wrap(node).find(this.titleNode).invoke("text").should("contain", title.substring(0, 18).toUpperCase());
                cy.wrap(node).find(this.contentNode).invoke("text").should("eq", content);
                cy.wrap(node).find(this.statusNode).invoke("text").should("eq", status);
            });
        });
    }

    verifyWarningDialogAppeared() {
        cy.get(this.cdkOverlayContainerSelector).then(cdkContainer => {
            assert.isTrue((cdkContainer.find(this.warningDialogSelector).length),
                "Warning dialog is not displayed!");
        });
    }

    confirmWarningDialog() {
        cy.get(this.cdkOverlayContainerSelector).then(cdkContainer => {
            let warningD = cdkContainer.find(this.warningDialogSelector);
            if (warningD.length) {
                cy.wrap(warningD).as("warning").find(this.titleDialogTxT).invoke("text")
                    .then(txt => cy.log(txt));
                cy.get("@warning").find(this.confirmButton).click();
                cy.wait(1000);
            }
        });
    }

    verifyOfferStatus(status) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).then(dialogSection => {
                cy.wrap(dialogSection).find(`${this.offerStatusTxT}`)
                    .invoke('text').then((text) => {
                        expect(text.toUpperCase()).to.equal(status.toUpperCase());
                    });
            });
        });
    }

    performAction(text) {
        cy.wait(3000);
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.get(`${this.contextMenuSelector}`).click();
        });
        cy.get(`${this.contextMenuOptions}`).contains(text).click();
    }

    waitForFormLoaded() {
        cy.log("Waiting waiting")
        cy.get(`${this.formDialogSelector}`).last().then((form) => {
            if (!form.is(":visible")) {
                cy.waitForFormLoaded();
            }
        });
    }

    confirmInternationalPayment() {
        // cy.intercept('POST', '**?plugin=SaveClaimPayment*').as('savePayment');
        cy.intercept('GET', '**?plugin=GetClaimPaymentList*').as('getPayment');
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).then(dialogSection => {
                cy.wrap(dialogSection).find("header:visible:first")
                    .invoke('text').then((text) => {
                        assert.isTrue(text.trim() === "Confirm payment", "The Header Text is matched!");
                    });
                cy.wrap(dialogSection).find(this.confirmButton).click().wait(1000);
            });
        });
        // cy.wait('@savePayment').its('response.statusCode').should('eq', 200);
        cy.wait('@getPayment').its('response.statusCode').should('eq', 200);
    }

    filterResults(text) {
        cy.get(`${this.dialogViewPortSelector}:visible`).last().within(() => {
            cy.get(`${this.filterTextBox}:visible`).clear().type(text);
        });
    }

    viewSpecificRowInResultTable(text) {
        cy.get(`${this.dialogViewPortSelector}:visible`).last().within(() => {
            table.viewSpecificRowInResultTable(text);
        });
    }

    waitForNotesTasksForm(counter = 0) {
        cy.get(`${this.dialogViewPortSelector}:visible`).last().within(() => {
            cy.get(`${this.notesTasksSelector}`).then((form) => {
                if (!form.is(":visible") && counter <= 5) {
                    counter = counter + 1;
                    cy.log("Waiting ...");
                    cy.wait(1000);
                    this.waitForNotesTasksForm(counter);
                }
            });
        });
    }

    verifyInformationInRightPanel(header, value) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            rightPanel.verifyInformation(header, value);
        });
    }

    selectMultipleValuesByIndex(label, nth) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().then(() => {
            cy.selectMultipleValuesByIndex(label, nth);
        });
    }

    saveFilter() {
        cy.intercept('POST', '**?plugin=SaveUserConfig*').as('saveFilter');
        this.clickButton("Save");
        cy.wait('@saveFilter').its('response.statusCode').should('eq', 200);
    }

    applyFilter() {
        cy.intercept('POST', '**?plugin=SaveUserConfig*').as('applyFilter');
        this.clickButton("Apply");
        cy.wait('@applyFilter').its('response.statusCode').should('eq', 200);
        cy.wait(1000);
    }

    clickOnPencilIconWithLabel(label) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().then(() => {
            cy.get(`[placeholder$='${label}']`).siblings().find(this.pencilIconSelector).click();
        });
    }

    selectComnonCode(value) {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            cy.get(this.searchInputSelector).clear().type(value);
            cy.wait(2000);
            cy.get(`${this.commonCodeSelector}:visible`).contains(value).click();
        });
        this.clickButton("Select");
        cy.waitForPageLoaded();
    }

    verifyAccountingPerDocumentTable(columnHeader, searchText) {
        cy.wait(1000);
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.get(`${this.tableSection.selector}`).then((table) => {
                console.log(`Table: ${table}`);
                const visibleTables = Cypress.$.makeArray(table).filter((el) => el.checkVisibility());
                (visibleTables.length > 1) ? visibleTables[length - 1] : visibleTables[0];
            }).within(() => {
                cy.get("thead").scrollIntoView().contains("th", columnHeader, { matchCase: false })
                    .invoke("index").then((index) => {
                        cy.get("tbody > tr").then($rowElement => {
                            var trigger = false;
                            const noOfRows = $rowElement.length;
                            for (let nthRow = 0; nthRow < noOfRows; nthRow++) {
                                // console.log(`Index: ${nthRow}`);
                                var text = "";
                                const $td = $rowElement.get(nthRow).getElementsByTagName("td")
                                    .item(index);
                                if ($td.childElementCount > 0) {
                                    const $span = $td.querySelector("span");
                                    text = $span.innerText;
                                } else {
                                    text = $td.innerText;
                                }
                                if (text.toLowerCase().endsWith(searchText.toLowerCase())) {
                                    $td.style.backgroundColor = "red";
                                    trigger = true;
                                }
                            }
                            assert.isTrue(trigger, `The value ${searchText.toUpperCase()} is displayed under Column: ${columnHeader.toUpperCase()}`);
                        });
                    });
            });
        });
    }

    selectObject() {
        cy.intercept('POST', '**?plugin=ConnectOfferMarineObjects*').as('saveObject');
        cy.intercept('GET', '**?plugin=GetConnectedOfferMarineObjects*').as('getObject');
        this.clickButton("Select");
        cy.wait('@saveObject').its('response.statusCode').should('eq', 200);
        cy.wait('@getObject').its('response.statusCode').should('eq', 200);
    }

    removeSpecificRow(text) {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            let { tableSection } = table.resultTableSection;
            table.waitForResultTableLoaded();
            cy.get(`${tableSection.selector}:visible`).within(() => {
                cy.get("tbody tr > td > span").contains(text, { matchCase: false }).parents(tableSection.rowSelector)
                    .within(() => {
                        cy.get(this.removeButtonSelector).click();
                    });
            });
        });
        cy.confirmDialog();
        cy.waitForPageLoaded();
    }

    /**
     * @description: Adding default columns for Legal Person Page
     */
    addDefaultColumnsForLegalPerson() {
        let trigger = false;
        let defaultColumns = ["Id", "Name", "Short Name", "SSN", "Email", "Type", "Division", "Country", "Status"];
        let beingAddedColumns = [];
        cy.get(this.dialogViewPortSelector).first().should("be.visible").then(() => {
            // First wait for the available columns displayed
            cy.get(this.availableDisplayedColumnSelector).should("be.visible").then((items) => {
                cy.wrap(items).find("label").each((label) => {
                    beingAddedColumns.push(label.text().trim());
                }).then(() => {
                    if (beingAddedColumns.toString() !== defaultColumns.toString()) {
                        trigger = true;
                        // Then remove all available columns
                        cy.get(`${this.selectAllDisplayedColumnSelector}:visible`).click();
                        cy.get(this.removeColumnButton).click();
                        // Then add default columns
                        this.addColumns("Id", "Name", "Short Name", "SSN", "Email", "Type", "Division", "Country", "Status");
                    } else {
                        this.clickButton("Close");
                    }
                });
            });
        });
    }

    verifyRequiredFieldError() {
        cy.get(`${this.dialogViewPortSelector}:visible`).first().within(() => {
            cy.verifyRequiredFieldError();
        });
    }

    confirmDialog() {
        cy.get(this.cdkOverlayContainerSelector).wait(1000).within(($popUpContainer) => {
            if ($popUpContainer.children(this.childDiv).length) {
                cy.get(`${this.confirmButton}:visible`).click();
            }
        });
        cy.wait(1000);
        cy.waitForPageLoaded();
    }

    closeDialog() {
        cy.get(this.cdkOverlayContainerSelector).wait(1000).within(($popUpContainer) => {
            if ($popUpContainer.children(this.childDiv).length) {
                cy.get(`${this.closeButton}:visible`).click();
            }
        });
        cy.wait(1000);
        cy.waitForPageLoaded();
    }

    verifyFilterValue(header, value) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(this.filterFieldSection).then(() => {
                cy.contains(this.filterField, header).then((headerElement) => {
                    cy.wrap(headerElement).parent().next("div").find("span").invoke("text").then(text => {
                        expect(text.trim().toUpperCase(),
                            `${header} contains ${value} as expected!`).to.contain(value.toUpperCase());
                    });
                });
            });
        });
    }

    inputValueByPlaceHolder(placeholderText, value) {
        cy.get(this.cdkOverlayContainerSelector).first().within(() => {
            cy.get(`${this.inputTextSelector}[placeholder$='${placeholderText}']:visible`).clear()
                .type(value);
        });
    }

    /**
     * @description: Adding default columns for Broker - Offer Page
     */
    addDefaultColumnsForOffer() {
        let trigger = false;
        let defaultColumns = ["ID", "Year", "Name", "Original Insured", "Text", "Team", "Offer Status", "Office", "Country"];
        let beingAddedColumns = [];
        cy.get(this.dialogViewPortSelector).first().should("be.visible").then(() => {
            // First wait for the available columns displayed
            cy.get(this.availableDisplayedColumnSelector).should("be.visible").then((items) => {
                cy.wrap(items).find("label").each((label) => {
                    beingAddedColumns.push(label.text().trim());
                }).then(() => {
                    if (beingAddedColumns.toString() !== defaultColumns.toString()) {
                        trigger = true;
                        // Then remove all available columns
                        cy.get(`${this.selectAllDisplayedColumnSelector}:visible`).click();
                        cy.get(this.removeColumnButton).click();
                        // Then add default columns
                        this.addColumns("ID", "Year", "Name", "Original Insured", "Text", "Team", "Offer Status", "Office", "Country");
                    } else {
                        this.clickButton("Close");
                    }
                });
            });
        });
    }

    verifyButtonIsDisabled(label) {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            cy.verifyButtonIsDisabled(label);
        });
        cy.wait(500);
    }

    verifyButtonIsEnabled(label) {
        cy.get(`${this.dialogViewPortSelector}:visible`).within(() => {
            cy.verifyButtonIsEnabled(label);
        });
        cy.wait(500);
    }

    verifyValueFromVerticalTable(header, searchText) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).first().within(() => {
                table.verifyValueFromVerticalTable(header, searchText);
            });
        });
    }

    clickBasedOnVisibleColumn(columnHeader, rowValue, clickableColumn) {
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).first().within(() => {
                table.clickBasedOnVisibleColumn(columnHeader, rowValue, clickableColumn);
            });
        });
    }

    addNewNote(noteType = "Call", desc, category = "None", doneDate = "None", attachment = "None") {
        cy.intercept("**POST*notes*init*").as("initNote");
        cy.clickButton("Note");
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).first().then(() => {
                cy.wait("@initNote").then(() => {
                    if (doneDate !== "None")
                        cy.get(this.doneDateForNoteTask).clear().type(doneDate);
                    if (category !== "None")
                        cy.selectValue("Category", category);
                    if (attachment !== "None")
                        cy.uploadFile(attachment);
                });
                cy.intercept("POST", "**POST*notes*").as("createNote");
                cy.checkRadioButton("Note Type", noteType);
                cy.inputTextEditor("Description", desc);
                cy.clickButton("Save");
                cy.wait("@createNote").its('response.statusCode').should('eq', 200);
            });
        });
        cy.verifyPopUp("Note has been created successfully.");
    }

    addNewTask(title, taskDesc, status = "ToDo", doneDate = "None", priority = "None", handler = "None", category = "None", group = "None", attachment = "None") {
        cy.intercept("**POST*activities*init*").as("initTask");
        cy.clickButton("Task");
        cy.get(this.cdkOverlayContainerSelector).then(() => {
            cy.get(`${this.dialogSectionSelector}:visible`).first().then(() => {
                cy.wait("@initTask").then(() => {
                    if (category !== "None")
                        cy.selectValue("Category", category);
                    if (status !== "ToDo")
                        cy.selectValue("Status", status);
                    if (priority !== "None")
                        cy.checkCheckbox("High priority");
                    if (handler !== "None")
                        cy.selectValue("Assignee", handler);
                    if (group !== "None")
                        cy.selectValue("Group", group);
                    if (doneDate !== "None")
                        cy.get(this.doneDateForNoteTask).clear().type(doneDate);
                    if (attachment !== "None")
                        cy.uploadFile(attachment);
                });
                cy.intercept("POST", "**POST*activities*").as("createTask");
                cy.inputValue("Title", title);
                cy.inputTextEditor("Description", taskDesc);
                cy.clickButton("Save");
                cy.wait("@createTask").its('response.statusCode').should('eq', 200);
            });
        });
        cy.verifyPopUp("Task has been created successfully.");
    }

}