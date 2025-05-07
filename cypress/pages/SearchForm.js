import { getValueFromArrayOfObject, getScrollableStatus } from "../support/utils";
import { CommonElements } from "./CommonElements";
const commonElements = new CommonElements();

export class SearchForm {
    // Dashboard Config Section 
    searchFormSection = {
        selector: "form[name='searchForm'] div[class*='form-search easy-search-area']", //"form[role='form'] > easy-search-area",        
        bulkCreateButton: "button[title='Bulk create']",
        inputField: "input[type='text']",
        generalInputField: "input",
        magnifierIcon: "i[class$='advance-search-icon']",
        customSelection: {
            selector: "d-select",
            selectizeInput: "div[class^='selectize-input']",
            selectMultipleSelector: "input[type='select-multiple']",
            optionValues: "div[class='selectize-dropdown-content'] div[class^='option']"
        },
        nvDropdown: commonElements.nvDropdownContainer,
        nvDropdownOptions: `${commonElements.nvDropdownPanel} ${commonElements.nvDropdownPanel_options}`,
        searchHashTagContainer: "div[class='hash-tag-container']",
        searchHashTag: "div[class^='search-hashtag']",
        removeSearchHashTag: "span[class='hashtag-remove']"
    }

    // Type Multiple DropDown
    inputSearchFieldForDropDownMenu = "input[type='search']"
    typeOptions = "a[class='dropdown-item active'] span[class='text']"


    statusField = "[placeholder$='Select Status']";
    statusInputField = "div[class='dropdown-menu open'] input[type='search']";
    statusOptions = "div[class='dropdown-menu open'] ul[class*='dropdown-menu inner'] li > a span";

    multiSelectDropdownSelector = "multi-select";
    multiSelectDropdownMenuSelector = "ul[class*='dropdown-menu inner'] li";
    multiSelectValueSelector = "ul[class*='dropdown-menu inner'] li > a span[class='text']";

    scrollableElementOnDialog = "nv-search-manage-filter-dialog article[class]";

    filterTable = "nv-user-shared-config nv-datatable";
    
    inputMultipleValues(objectValue) {
        for (let property in objectValue) {
            this.inputValue(property, objectValue[property]);
        }
    }

    inputValue(label, value) {
        cy.get(`${this.searchFormSection.selector}:visible`).scrollIntoView().within((search) => {
            cy.inputValue(label, value);
        });
    }

    focusOnLabel(label) {
        cy.get(`${this.searchFormSection.selector}:visible`).scrollIntoView().within((search) => {
            cy.getInputElement(label).click();
        });
    }

    selectValueForMultipleFields(obj) {
        for (let prop in obj) {
            cy.log(`${prop}: ${obj[prop]}`);
            this.selectValue(prop, obj[prop]);
        }
    }

    selectValue(label, searchText) {
        cy.get(`${this.searchFormSection.selector}:visible`).scrollIntoView().within(() => {
            cy.selectValue(label, searchText);  
        });
        cy.wait(500);
    }

    selectVesselTypeByDataValue(dataValue) {
        let { customSelection } = this.searchFormSection;
        let inputElement;
        cy.get(`${this.searchFormSection.selector}:visible`).scrollIntoView().within(() => {
            cy.get(`[placeholder$='Vessel Type']`).then((ele) => {
                inputElement = ele.get(0).tagName;
                return ele.get(0);
            }).then((id) => {
                cy.get(id).find("input").click();
                cy.root().parents('body')
                    .find(`${customSelection.optionValues}[data-value="${dataValue}"]`)
                    .scrollIntoView().click();
                cy.wait(500);
            });
        });
    }

    selectValueByDataValue(label, dataValue) {
        let { customSelection } = this.searchFormSection;
        let inputElement;
        cy.get(`${this.searchFormSection.selector}:visible`).scrollIntoView().within(() => {
            cy.get(`[placeholder$='Select ${label}']`).then((ele) => {
                inputElement = ele.get(0).tagName;
                return ele.get(0);
            }).then((id) => {
                cy.get(id).find("input").click();
                cy.root().parents('body')
                    .find(`${customSelection.optionValues}[data-value="${dataValue}"]`)
                    .scrollIntoView().click();
                cy.wait(200);
            });
        });
    }

    selectValueByIndex(label, indexValue) {
        cy.get(`d-select[id*='searchForm.${label}']`).click();
        cy.get("div[class='selectize-dropdown-content']:visible").within((dropDownMenu) => {
            const optLength = dropDownMenu.find('div[data-value]').length;
            console.log(`Number of option is ${optLength}`);
            if (optLength) {
                if (dropDownMenu.find(`div[data-value='${indexValue}']`).length) {
                    dropDownMenu.find(`div[data-value='${indexValue}']`).click();
                    return false;
                } else {
                    if (dropDownMenu.find("div[data-value]").first().attr("data-value").includes(" ")) {
                        for (let index = 0; index < optLength; index++) {
                            let dataValue = dropDownMenu.find("div[data-value]").get(index).getAttribute("data-value");
                            if (dataValue.trim() === indexValue.toString()) {
                                dropDownMenu.find("div[data-value]").get(index).click();
                                return false;
                            }
                        }
                    }
                }
            }
        });
        cy.wait(500);
    }

    clickResetButton() {
        cy.get(`${this.searchFormSection.selector}:visible`).within(() => {
            cy.get(this.searchFormSection.searchHashTag).then((tagElement) => {
                if (tagElement.find(this.searchFormSection.removeSearchHashTag).length) {
                    cy.log("Click RESET button");
                    cy.get(commonElements.resetBtn).click();
                    cy.wait(2000);
                }
            });
        });
        this.waitForSearchCompleted();
        cy.waitForPageLoaded();
    }

    clickSearchButton() {
        cy.get(this.searchFormSection.selector).within(() => {
            cy.log("click SEARCH button!");
            cy.get(commonElements.searchBtn).should("not.be.disabled").click({force: true});
        });
        cy.wait(1000);
        this.waitForSearchCompleted();
        cy.waitForPopUpDisappeared();
        cy.waitForPageLoaded();
    }

    waitForSearchCompleted(counter = 0) {
        cy.get(`${commonElements.searchBtn}:visible`).then($search => {
            if ($search.is(":disabled") && counter <= 5) {
                counter = counter + 1;
                cy.log("Waiting for Search completed ...");
                cy.wait(2000);
                this.waitForSearchCompleted(counter);
            }
        });
        cy.waitForPageLoaded();
    }

    clickCreateButton() {
        cy.get(`${this.searchFormSection.selector}:visible`).within((view) => {
            cy.get("button").contains("Create").click();
        });
        cy.wait(1000);
        cy.waitForPopUpDisappeared();
        cy.waitForPageLoaded();
    }

    clickAddButton() {
        cy.get(`${this.searchFormSection.selector}:visible`).within((view) => {
            cy.get(commonElements.nvButton).contains("Add").click();
        });
        cy.wait(1000);
        cy.waitForPageLoaded();
    }

    verifyInputtedValue(label, text) {
        cy.get(`${this.searchFormSection.selector}:visible`).scrollIntoView().within((viewPort) => {
            cy.get(`${this.searchFormSection.generalInputField}[placeholder$='${label}']:visible`)
                .then((input) => {
                    let textValue = input.val();
                    expect(textValue).to.be.equal(text);
                })
        });
    }

    verifySearchCriteria(label, text) {
        cy.get(`${this.searchFormSection.selector}:visible`).scrollIntoView().within(() => {
            cy.get(`${this.searchFormSection.searchHashTag} div[title='${label}'] > span`).then(($span) => {
                $span.css("color", "red");
                const actualText = $span.text().trim();
                expect(actualText.toUpperCase()).to.be.contain(text.toUpperCase());
            });
        });
    }

    removeSearchCriteria(label) {
        cy.get(`${this.searchFormSection.selector}:visible`).scrollIntoView().within(() => {
            cy.get(this.searchFormSection.searchHashTag).then(($container) => {
                if ($container.find(`div[title='${label}']`).length) {
                    cy.wrap($container).find(`div[title='${label}'] ${this.searchFormSection.removeSearchHashTag}`)
                        .should("be.visible").click().wait(500);
                }               
            });            
        });
        cy.waitForPageLoaded();
    }

    verifySearchCriteriaEmpty() {
        cy.get(`${this.searchFormSection.selector}:visible`).scrollIntoView().within(() => {
            cy.get(this.searchFormSection.searchHashTag).then(($container) => {
                expect($container.find(this.searchFormSection.removeSearchHashTag).length).equal(0);
            });
        });
    }

    // Perform Search by inputting the specific text, and click search button 
    performSearchByLabel(label, text) {
        cy.get(`${this.searchFormSection.selector}:visible`).as("searchForm").within(() => {
            cy.get(this.searchFormSection.inputField)
                .get("label")
                .find('span')
                .contains(label)
                //.type(`${text}{enter}`);  // Not work
                .type(text);
        });
        this.clickSearchButton();
        cy.wait(1000);
    }

    clickMagnifierIcon(label) {
        cy.get(`${this.searchFormSection.selector}:visible`).scrollIntoView().within(() => {
            cy.get(`[placeholder$='${label}']`).then((ele) => {
                return ele.get(0);
            }).then((id) => {
                cy.get(id).find(this.searchFormSection.magnifierIcon).click();
            });
        });
        cy.wait(1000);
    }

    inputValueByPlaceHolder(placeholderText, text) {
        cy.get(`${this.searchFormSection.selector}`).scrollIntoView().within(() => {
            cy.get(`${this.searchFormSection.inputField}[placeholder$='${placeholderText}']:visible`).clear()
                .type(text);
        });
        cy.wait(500);
    }

    selectStatus(value) {
        cy.get(this.statusField).click();
        cy.get(this.statusInputField).type(value);
        cy.wait(500);
        cy.get(this.statusOptions).last().contains(value, { matchCase: false }).click();
    }

    selectMultipleValuesByIndex(label, indexValue) {
        cy.get(`${this.multiSelectDropdownSelector}[id*='searchForm.${label}']`).click();
        cy.wait(200);
        cy.get(`${this.multiSelectDropdownMenuSelector}:nth-child(${indexValue}) > a span[class='text']:visible`).click();
        cy.realPress("Tab");
    }

    manageFilter() {
        cy.intercept('GET', '**?plugin=GetUserConfig*').as('getFilter');
        cy.intercept('GET', '**?plugin=SearchSharedUserConfig*').as('getFilter');
        cy.get(`${this.searchFormSection.selector}:visible`).within(() => {
            cy.contains("Manage filters").click();
            cy.wait(500);
        });
        cy.waitForRequest('getFilter');
        cy.waitForRequest('getSharedFilters');
    }

    deletePredefinedFilter(filterName) {
        cy.intercept('GET', '**?plugin=GetUserConfig*').as('getFilters');
        cy.intercept('GET', '**?plugin=SearchSharedUserConfig*').as('getSharedFilters');
        cy.get(`${this.searchFormSection.selector}:visible`).within(() => {
            cy.log("Deleting the pre-defined filter if any");
            cy.contains("Manage filters").click();
            cy.wait(1000);
        });
        // Using API to get the filter settings
        cy.wait('@getFilters').its('response.body').then(({data}) => {
            const { Configs } = data;
            let id = getValueFromArrayOfObject(Configs, "Name", filterName, "Id");
            if (id) {
                cy.waitForRequest('getSharedFilters');
                cy.get(this.filterTable).scrollIntoView().then((table) => {
                    const $col = table.find(`td:contains('${filterName}')`);
                    const $row = $col.parent("tr");
                    const $trashIcon = $row.find("td button > i[class*='trash']");
                    $trashIcon.click();
                });
                cy.wrap(Cypress.$("body")).find(commonElements.nvButton).contains("Confirm").click();
            }
        });
        cy.waitForPageLoaded();
    }

}