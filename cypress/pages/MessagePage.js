// import { DialogElements } from "./DialogElements";
import { CommonElements } from "./CommonElements";
const common = new CommonElements();

export class MessagePage {
    mainContainerSection = {
        selector: "section[class='view-port hbox']",

        searchSection: {
            searchNav: "div[class='message-nav-item pb-1']",
            dropDownSelector: "d-select",
            dropDownMenu: "div[class='selectize-dropdown-content']",
            inputField: "input[placeholder]",
            searchIcon: ".button-icon.fa-search"
        },

        leftSection: {
            selector: "article[class='thread']",
            addButtonSelector: "nv-button[buttoncommontype='create'] > button",
            messageNavItem: "div[class='message-nav-item']",
            spinner: "div[class='message-nav-item'] i[class*='fa-spinner']",

            messageBoxSelector: "div[class='message-nav-item'] li > span[class='caption']",
            noMessageSelector: "div[class='message-nav-item'] li span[class='badge']",
            messageList: "div[class^='message-thread media']", 
            messageTitle: "div[class='media-body'] h4"
        },

        rightSection: {
            selector: "article[class^='message-topic']",
            subjectInput: "input[id='composeForm.Subject']",
            toInput: {
                selector: "input[type='select-multiple'][placeholder='Search To']",
                optionValues: "div[class='selectize-dropdown-content'] div[class='option active']"
            },
            messageTextArea: "textarea",
            messageTopic: "section[class*='paris-message-topic']"
        },

        messageTopicContainer: {
            selector: "article[class*='message-topic']",
            receiverSelector: "div[class='person-name']",
            subjectText: `${common.nvTabs} ${common.nvTabItem} i[class*='envelope'] + span`, // Adjacent Sibling Selector (+)
            messageBodyText: `${common.nvListView} div[class*='nv-list-view-item'] div[class='message-body']`
        }
    }

    verifySearchResult(text) {
        const { leftSection } = this.mainContainerSection;
        cy.get(leftSection.selector).within(() => {
            cy.get(leftSection.messageList).each(($element) => {
                cy.wrap($element).should("contain", text);
            })
        })
    }

    searchMessageBy(typeSearch = "Legal Person", text) {
        const { searchSection } = this.mainContainerSection;
        // Choose to search by Legal Person
        cy.get(`${searchSection.dropDownSelector}:visible`).click();
        cy.get(`${searchSection.dropDownMenu}:visible`).contains(typeSearch, { matchCase: false }).click();
        // Type on the search input
        cy.get(`${searchSection.searchNav}:visible`).within(() => {
            // Type on the search input
            cy.get(`${searchSection.inputField}:visible`).type(text);
        });
        if (typeSearch == "Legal Person") {
            cy.get(`${searchSection.dropDownMenu}:visible`).contains(text, {matchCase: false}).click();
        }
        // Click on search button
        cy.get(searchSection.searchIcon).click({force: true});
        cy.waitForPageLoaded();
        this.waitForMessage();
    }

    markAsUntreated() {
        const { rightSection } = this.mainContainerSection;
        cy.get(`${rightSection.selector}:visible`).within((right) => {
            cy.get(common.nvTabs).find(common.nvActionMenu).click();
        });
        cy.get(common.nvMenuItem)
            .contains("Mark as Untreated", { matchCase: false }).click();
        cy.waitForPageLoaded();
    }

    verifyUntreatedMessage(subject) {
        cy.get(common.nvTabItem)
            .contains(subject, { matchCase: false }).parent().within(() => {
                cy.log("Verifying message marked as Untreated!");
                cy.get("i",).should("not.have.class", "fa-check-circle");
            });
    }

    verifyMessageContent(to, subject, body) {
        const { messageTopicContainer } = this.mainContainerSection;
        cy.get(messageTopicContainer.selector).within(() => {
            cy.get(messageTopicContainer.receiverSelector).should("contain", to);
            cy.get(messageTopicContainer.subjectText).should("contain", subject);
            cy.get(`${messageTopicContainer.messageBodyText}:last`).should("contain", body);
        });
    }

    verifyReplyMessage(newMessage) {
        const { messageTopicContainer } = this.mainContainerSection;
        cy.get(messageTopicContainer.selector).within(() => {
            cy.get("footer").within(() => {
                cy.get("button").contains("Reply").click();
                cy.get("textarea.form-control").type(newMessage)
                cy.clickAndWait("Send");
            });
            cy.get(`${messageTopicContainer.messageBodyText}:last`).should("contain", newMessage);
        });        
    }

    clickFirstMessage() {
        cy.get(`${this.mainContainerSection.selector}:visible`).within(() => {
            const { leftSection } = this.mainContainerSection;
            cy.get(leftSection.selector).should("be.visible").within(() => {
                cy.get(`${leftSection.messageList} ${leftSection.messageTitle}`)
                    .should("be.visible").first().click();
                cy.wait(800);
            });
        });
        cy.waitForPageLoaded();
    }

    waitForMessage() {
        const { leftSection } = this.mainContainerSection;
        cy.get(leftSection.selector).should("be.visible").then((left) => {
            if (left.find(leftSection.spinner).length) {
                cy.log("Waiting for messages to be loaded completely!");
                cy.wait(500);
                this.waitForMessage();
            }
        });
        cy.waitForPageLoaded();
    }

    clickCreateNewMessage() {
        cy.get(this.mainContainerSection.selector).should("be.visible").within((container) => {
            const { leftSection } = this.mainContainerSection;
            cy.get(leftSection.selector).should("be.visible").within(() => {
                cy.log("Click on Add New button");
                cy.get(leftSection.addButtonSelector).should("be.visible")
                    .click({force: true}).wait(1000);
            });
        });
        cy.waitForPageLoaded();
    }

    inputSubject(text) {
        cy.log("Input Subject: " + text);
        cy.get(this.mainContainerSection.selector).should("be.visible").within((container) => {
            const { rightSection } = this.mainContainerSection;
            cy.get(rightSection.selector).should("be.visible").within((rightMenu) => {
                cy.get(rightSection.subjectInput).should("be.visible").type(text);
            });
        });
    }

    inputTo(text) {
        cy.log("Input To: " + text);
        const { rightSection } = this.mainContainerSection;
        cy.get(this.mainContainerSection.selector).should("be.visible").within((container) => {
            cy.get(rightSection.selector).should("be.visible").within((rightMenu) => {
                cy.get(rightSection.toInput.selector)
                    .should("be.visible").click().type(text);
            });
        });
        cy.wait(1000);
        cy.get(rightSection.toInput.optionValues).should("be.visible").first().click();
    }

    inputMessage(text) {
        cy.log("Input Message: " + text);
        cy.get(this.mainContainerSection.selector).should("be.visible").within((container) => {
            const { rightSection } = this.mainContainerSection;
            cy.get(rightSection.selector).should("be.visible").within((rightMenu) => {
                cy.get(rightSection.messageTextArea).should("be.visible").type(text);
            });
        });
    }

}   