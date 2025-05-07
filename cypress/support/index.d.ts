/// <reference types="Cypress" />
/// <reference types="@bahmutov/cy-grep" />

declare namespace Cypress {
    interface Chainable {

        /**
         * @description This is used to log into Admin Hub site
         * @param {String} username - Enter username
         * @param {String} password - Enter password
         */
        logIntoAdminHub(username: String, password: String): Cypress.Chainable<JQuery>;
        
        /**
         * @description This is used to log into Portal site
         * @param {String} username - Enter username
         * @param {String} password - Enter password
         * @param {Number} delay - Enter a number
         */
        logIntoPortal(username: String, password: String, delay: any): Cypress.Chainable<JQuery>;

        /**
         * @description is used to wait for page completely loaded based on checking fillBar's width = 0px
         */
        waitForPageLoaded(): Cypress.Chainable<JQuery>;

        /**
         * @description is used to wait for some seconds (optional parameter) until the element is visible
         * @param {String} selector - Selector of element
         * @param {Number} second - seconds to wait
         */
        waitForElementVisible(selector: String, second: Number): Cypress.Chainable<JQuery>;

        /**
        * @description is used to wait for uploading completely based on checking progressBar's width = 0px
        */
        waitForUploadCompleted(): Cypress.Chainable<JQuery>;

        /**
        * @description is used to confirm (click OK btn) the dialog popUp 
        */
        confirmDialog(): Cypress.Chainable<JQuery>;

        /**
        * @description is used to close (click Cancel btn) the dialog popUp 
        */
        closeConfirmDialog(): Cypress.Chainable<JQuery>;

        /**
        * @description is used to confirm (click OK btn) the JS Confirmation  
        */
        confirmJSConfirmation(): Cypress.Chainable<JQuery>;

        /**
        * @description is used to close (click Cancel btn) the JS Confirmation 
        */
        cancelJSConfirmation(): Cypress.Chainable<JQuery>;

        /**
         * @description is used to input the value for TextArea field
         * @param {String} label - Label of TextArea field (Optional param)
         * @param {String} value - Value to input
         */
        inputValueForTextArea(label: String, value: String): Cypress.Chainable<JQuery>;

        /**
         * @description is used to find the input field based on label (exact match using RegExp) of it
         * @param {String} label - Label of input field
         * @return {Element} chainable input element
         */
        getInputElement(label: String): Cypress.Chainable<JQuery>;

        /**
         * @description is used to clear and input the value for Input field
         * @param {String} label - Name of Input field
         * @param {String} value - Value to input
         */
        inputValue(label: String, value: String): Cypress.Chainable<JQuery>;

        /**
         * @description is used to verify the inputted value for Input field
         * @param {String} label - Name of Input field
         * @param {String} value - Value to compare
         */
        verifyInputtedValue(label: String, value: String): Cypress.Chainable<JQuery>;

        /**
         * @description is used to verify the inputted value for TextArea field
         * @param {String} label - Name of TextArea field
         * @param {String} value - Value to compare
         */
        verifyInputtedTextArea(label: String, value: String): Cypress.Chainable<JQuery>;

        /**
         * @description is used to input the value for Input field based on its placeholder value
         * @param {String} placeholderText - Text Value of Placeholder of input element
         * @param {String} value - Value to input
         */
        inputValueByPlaceHolder(placeholderText: String, value: String): Cypress.Chainable<JQuery>;


        

        /**
         * @description is used to click on any button in view port section (main container)
         * @param {string} label - Name of button (Title, Text or Placeholder attribute)
         */
        clickButton(label: String): Cypress.Chainable<JQuery>;

        

    

    }
}