// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
/// <reference types="cypress" />
// Import commands.js using ES2015 syntax:
import './commands'
// Import Cypress Real Events
import "cypress-real-events/support";
require('cypress-plugin-tab');

// cypress-cloud plugin to run the test parallel
// import "cypress-cloud/support";

// https://github.com/bahmutov/cy-grep
const registerCypressGrep = require('@bahmutov/cy-grep');
registerCypressGrep();

// load and register the grep feature using "require" function
// https://github.com/cypress-io/cypress/tree/develop/npm/grep
// const registerCypressGrep = require('@cypress/grep');
// registerCypressGrep();

/**
 * Is used to add screenshot and video for failed mochawesome test
 */
import addContext from 'mochawesome/addContext';
const titleToFileName = (title) =>
   title.replace(/[:\/]/g, '');

Cypress.on('test:after:run', (test, runnable) => {
   if (test.state === 'failed') {
      let parent = runnable.parent;
      let filename = '';
      while (parent && parent.title) {
         filename = `${titleToFileName(parent.title)} -- ${filename}`;
         parent = parent.parent;
      }
      filename += `${titleToFileName(test.title)} (failed).png`;
      addContext({ test }, `../screenshots/${Cypress.spec.name}/${filename}`);    
   }
   // Add the video to failure
   // addContext({ test }, `../videos/${Cypress.spec.name}.mp4`);
});