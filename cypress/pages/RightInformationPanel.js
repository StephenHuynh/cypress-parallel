/*
    Page Object for Information - Right Panel
*/
export class RightInformationPanel {
    // Information - Right Panel
    rightPanelSelector = "section[class^='information']"
    inforHeaderSelector = "dt"
    inforValueSelector = "dd"

    // Dialog PopUp
    popUpSelector = "section[class*='dialog']"
    confirmButton = "button[class$='btn-primary']"
    closeButton = "button[class$='btn-default']"


    verifyInformation(header, value) {
        cy.get(this.rightPanelSelector).within(() => {
            cy.get(this.inforHeaderSelector).then((headerName) => {
                for (let index = 0; index < headerName.length; index++) {
                    const headerText = headerName[index].textContent.trim().replace(" ", "");
                    if (headerText.endsWith(header.replace(" ", ""))) {
                        let node = headerName[index].nextElementSibling;
                        if (node.nodeType === 1) {
                            return node;
                        }
                        else {
                            console.log("Error !!!!!!!!!!!!");
                        }
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
        cy.get(this.rightPanelSelector).within(() => {
            cy.get(this.inforHeaderSelector).then((headerName) => {
                for (let index = 0; index < headerName.length; index++) {
                    const headerText = headerName[index].textContent.trim();
                    if (headerText.includes(header)) {
                        let node = headerName[index].nextSibling
                        if (node.nextSibling.nodeName === "#comment") {
                            return node.nextSibling.nextSibling;
                        } else {
                            return node.nextSibling;
                        }
                    }
                }
            });
        }).then((element) => {
            // return cy.wrap(element);
            //     .then(text => {
            //     return text
            // });
            return cy.wrap(element).invoke("text");
        });
    }

    copyClaimLink() {
        cy.get("bo-claim-id nv-copy-text pre").realHover('mouse');
        cy.get("button[title='Copy Link']").click();
    }

    getClaimID() {
        cy.get("bo-claim-id nv-copy-text pre").invoke("text").then((text) => {
            const result = text.toString().replace(' ', '').trim();
            console.log(`Result: ${result}`);
            return result;
        });
    }

}