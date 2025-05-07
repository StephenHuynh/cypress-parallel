export class ObjectsPage {

    searchAreaSelector = "div[class*='form-search easy-search-area']";
    labelSearchSelector = "div[class*='form-search easy-search-area'] div label";
    nameInputSelector = "input[id='formSearchObject.Name']";
    objNumberInputSelector = "input[id='formSearchObject.ObjectNumber']";
    iMONumberInputSelector = "input[id='formSearchObject.IMONumber']";
    callSignalInputSelector = "input[id='formSearchObject.CallSignal']";
    callSignalInputSelector = "input[id='formSearchObject.Identification']";

    tableSelector = "#paris-search-object";

    // Object Type Dropdown
    objectTypeButtonSelector = "button[title='Select Object Type']";
    objectTypeMenuSelector = "div[class='dropdown-menu open']"
    spinner = "i[class$='fa fa-spinner fa-spin']";

    resultTableSection = {
        selector: "section[class='search-results-table']",

        tableSection: {
            selector: "table[class^='table table-hover']",
            headerSelector: "table[class^='table table-hover'] thead tr th",
            // rowSelector: "tbody tr[role='row']",
            rowSelector: "tr[role='row']",
            cellSelector: "td",
            buttonSelector: "button[type='button']",
            aLinkSelector: "a"
        },

        editButtonSelector: "button[title='Edit columns']"
    }

    selectObjectType(value) {
        cy.get(`${this.objectTypeButtonSelector}`).last().scrollIntoView(); // Do not use ":visible" to scrollIntoView
        cy.get(`${this.objectTypeButtonSelector}:visible`).click();
        cy.get(`${this.objectTypeMenuSelector}:visible`).within((menu) => {
            cy.get("input").type(value);
            cy.wait(200);
            cy.contains("a", value, { matchCase: false }).click().tab();
        });
    }

    editDescription(searchText, newText) {
        cy.get("td span").contains(searchText).realHover('mouse');
        cy.get("span > i[class$='fa-pencil-alt']:visible").click();
        cy.wait(1000);
        // Unable to work with Headless mode if not use {force: true}
        cy.get("td[class$='attachment-description']").find("textarea[id*='text-area-attachment']").clear({force: true}).type(newText, {force: true});
        // Unable to work with Headless mode if not use {force: true}
        cy.get("td[class$='attachment-description']").find("button[title='Save']").click({force: true});
        cy.wait(500);
        cy.waitForPopUpDisappeared();        
    }

    viewAttachedFileAndVerifyContentBasedOnColumn(columnHeader, filename, contentFile) {
        let { tableSection } = this.resultTableSection;
        cy.get(`${tableSection.selector}:visible`).within(() => {
            cy.get("thead").contains('th', columnHeader, { matchCase: false }).invoke('index').then((index) => {
                cy.get("tbody > tr").each(($element) => {
                    cy.wrap($element).within(() => {
                        cy.get("td")
                            .eq(index).then(($cell) => {                            
                                let text = $cell.children('span').text().trim();
                                expect(text).to.contains(filename);
                                let link = $cell.find('a');
                                link.css("background", "red");
                                //link.removeAttr('target');
                                // console.log(link);
                                //link.trigger("click"); // Does not click on link
                                // link.click(function(){
                                //     jQuery(".pre").text()
                                // });
                                const linkFile = link.attr("href");
                            //     cy.wrap(link).click().then(() => {
                            //         cy.wait(1000);
                            //         cy.document().its("pre").then((element) => {
                            //             console.log(element.text());
                            //         });
                            //    });
                                cy.visit(Cypress.env(''))
                               
                            })
                    })
                })
            })
        });
        cy.wait("2000")
        cy.get("body pre").contains(contentFile);
        cy.document().then((doc) => {
            // work with document element
            cy.log(doc);
          })
        cy.wait(2000);
    }

    viewAttachedTxtFile(columnHeader, filename, contentFile) {
        let { tableSection } = this.resultTableSection;
        cy.get(`${tableSection.selector}:visible`).within(() => {
            cy.get("thead").contains('th', columnHeader, { matchCase: false }).invoke('index').then((index) => {
                cy.get("tbody > tr").each(($element) => {
                    cy.wrap($element).within(() => {
                        cy.get("td")
                            .eq(index).then(($cell) => {                            
                                let text = $cell.children('span').text().trim();
                                expect(text).to.contains(filename);
                                let link = $cell.find('a');
                                link.css("background", "red");
                                const linkFile = link.attr("href");
                                cy.request("/backoffice/index.php" + linkFile).its("body").should("include", contentFile);
                                cy.wait(2000);
                            });
                    });
                });
            });
        });
    }
}
