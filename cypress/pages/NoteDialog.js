export class NoteDialog {

    //Note List View
    noteListViewSelector = "bo-paris-note-fixed-list"
    noteItemSelector = "div[class^='nv-list-view-item ']"
    viewButtonSelector = "button[title='View']"
    iconSelector = "span[class='title'] i"
    noteTitleSelector = "section[class^='body-content'] bo-content-transformer"

    // moved to UIViewSection
    returnType(text) {
        let icons = ["fa-question", "fa-phone", "fa-meetup", "fa-envelope"]
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
        }
        return returnValue
    }

    // replaced by UIViewSection.verifyLatestNote(...args)
    // should be tested and update the tests properly
    verifyNewlyCreatedNote(type = "", title = "") {
        cy.get(`${this.noteListViewSelector}`)
            .within(() => {
                // cy.wait(2000)
                cy.get(`${this.noteItemSelector}`).first()
                    .within((item) => {
                        let expectedType = this.returnType(type);
                        // console.log("Expected Value", expectedType);                    
                        cy.wrap(item).as("noteItem")
                        if (type != "") {
                            cy.get("@noteItem").find(this.iconSelector)
                                .invoke("attr", "class").then((actualValue) => {
                                    // console.log("ActualValue", actualValue)
                                    expect(actualValue).to.contains(expectedType)
                                });
                        }
                        if (title != "") {
                            //cy.log("Checking title")
                            cy.get("@noteItem").find(this.noteTitleSelector).contains(title)
                        }
                    });
            });
    }

    // replaced by UIViewSection.viewSpecificItem(txt)
    // should be tested and update the tests properly
    viewSpecificItem(text = "") {
        cy.get(`${this.noteListViewSelector}`)
            .within((table) => {
                cy.get(`${this.noteItemSelector}`).each((item, index, list) => {
                    console.log("Index value: " + index)
                    if (text === "") {
                        //click View icon for the first item
                        //console.log("ITEM: ", item.find(this.viewButtonSelector));
                        cy.wrap(item).find(this.viewButtonSelector).click();
                        return false;
                    } else {
                        cy.wrap(item).find("p").then(($ele) => {
                            if ($ele.text() === text) {
                                cy.wrap(item).find(this.viewButtonSelector).click();
                                //cy.log("Reassign value for index")
                                return false;
                            }
                        });
                    }
                });
            });
        cy.waitForPageLoaded();
    }
}
