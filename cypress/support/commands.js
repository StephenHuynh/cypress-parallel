/// <reference types="Cypress" />
// require('@reportportal/agent-js-cypress/lib/commands/reportPortalCommands');

import "cypress-wait-until";
import "cypress-file-upload";
import 'cypress-plugin-api';
import LoginPage from "../pages/LoginPage";
import { AppLauncher } from "../pages/AppLauncher";
import { CommonElements } from "../pages/CommonElements";
import { ResultTable } from "../pages/ResultTable";
import { NoteDialog } from "../pages/NoteDialog";
import { DialogElements } from "../pages/DialogElements";
import { Header } from "../pages/Header";
import { getCurrentDateFormatted, findIndexContaining, removeAllSpace, replaceCharsInArray, isArraySortedAscending, isArraySortedDescending } from "../support/utils";
let normalTimeout = 50000;

const loginPage = new LoginPage();
const appLauncher = new AppLauncher();
const commonElements = new CommonElements();
const resultTable = new ResultTable();
const dialog = new DialogElements();
const noteDialog = new NoteDialog();
const header = new Header();

const { portal, adminHub, api } = Cypress.env();

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// Comment to force Test Execution stopped 
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false
});

Cypress.Commands.add("getAuthorizedToken", (userID = "web") => {
    cy.request({
        url: `https://parisapi:notredame@apidev.noriacloud.com/noria-dev/rest/auth/${userID}/token`,
        method: "GET"
    }).then((response) => {
        console.log(response);
        let authorizedToken = response.headers["authorization"];
        expect(response.status).to.equal(200);
        // Cypress.env("user_access_token", authorizedToken);
        window.localStorage.setItem("Authorization", `Bearer ${authorizedToken}`);
        return authorizedToken;
    });
});

Cypress.Commands.add("loginAPI", (authURL, token) => {
    cy.api({
        url: authURL,
        method: "GET",
        headers: {
            Authorization: token,
        },
    }).then((response) => {
        const authorizedToken = response.headers.authorization;
        expect(response.status).to.equal(200);
        return authorizedToken;
    });
});

Cypress.Commands.add("loginCloudAPI", (authURL, client) => {
    cy.request({
        url: authURL + "token",
        method: "POST",
        body: {
            ClientId: client.clientId,
            ClientSecret: client.clientSecret,
            Scope: client.scope,
            User: {
                ExternalId: "WEA"
            }
        },
    }).then((response) => {
        return response.body.Token.access_token;
    });
});

Cypress.Commands.add("getClaimDetails", (envValue, authToken, fromDate, toDate) => {
    cy.request({
        url: api.baseEndpoint + "claims",
        method: "GET",
        qs: {
            maxResults: 5,
            fromDate: fromDate, // Coverage - Start Date
            toDate: toDate, // Coverage - End Date
            orderBy: "CREATED",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(`cypress/fixtures/${envValue}-claimDetails.json`, response.body);
    });
}
);

Cypress.Commands.add("getPAndIClaimDetails", (authToken, fromDate, toDate, id = "") => {
    cy.request({
        url: api.baseEndpoint + "claims",
        method: "GET",
        qs: {
            firstResult: 0,
            maxResults: 3,
            fromDate: fromDate,
            toDate: toDate,
            claimId: id,
            statuses: ["ACTIVE_1"],
            agreementTypes: ["PI_11"],
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body.result;
    });
});

Cypress.Commands.add("getPAndIClaimDetailsByID", (authToken, id) => {
    cy.request({
        url: api.baseEndpoint + `claims/${id}`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getClaimEvents", (authToken) => {
    cy.request({
        url: api.baseEndpoint + `claimevents`,
        method: "GET",
        qs: {
            firstResult: 0,
            maxResults: 5,
            orderBy: "EVENT_ID",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getClaimEventsByDate", (authToken, fromDate, toDate) => {
    cy.request({
        url: api.baseEndpoint + "claimevents",
        method: "GET",
        qs: {
            maxResults: 10,
            fromDate: fromDate,
            toDate: toDate,
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body.result;
    });
});

Cypress.Commands.add("getClaimPayments", (authToken, claimID) => {
    cy.request({
        url: api.baseEndpoint + `claims/${claimID}/payments`,
        method: "GET",
        qs: {
            firstResult: 0,
            maxResults: 5
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getClaimReserves", (authToken, claimID) => {
    cy.request({
        url: api.baseEndpoint + `claims/${claimID}/reserves`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getCoverageDetails", (envValue, authToken) => {
    cy.request({
        url: api.baseEndpoint + "coverages/active",
        method: "GET",
        qs: {
            maxResults: 20,
            orderBy: "START_DATE",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(`cypress/fixtures/${envValue}-coverageDetails.json`, response.body);
    });
});

Cypress.Commands.add("getPAndICoverageDetails", (authToken) => {
    cy.request({
        url: api.baseEndpoint + "coverages/active",
        method: "GET",
        qs: {
            firstResult: 10,
            maxResults: 10,
            agreementTypes: ["PI_11"],
            orderBy: "START_DATE",
            orderByDirection: "DESC",
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body.result;
    });
});

Cypress.Commands.add("getSignatureDetails", (envValue, authToken, userId) => {
    cy.request({
        url: api.baseEndpoint + `signatures/${userId}`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(`cypress/fixtures/${envValue}-${userId}Details.json`, response.body);
    });
});

Cypress.Commands.add("getAllObjectVersions", (authToken, objectNumber) => {
    cy.request({
        url: api.baseEndpoint + `objects/${objectNumber}/versions`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getObjectNameByVersionId", (authToken, versionId) => {
    cy.request({
        url: api.baseEndpoint + `objects/versions/${versionId}`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        let { name } = response.body;
        return name;
    });
});

Cypress.Commands.add("getObjectDetails", (envValue, authToken, name) => {
    name = name + " %" || "%";
    cy.request({
        url: api.baseEndpoint + "objects",
        method: "GET",
        qs: {
            maxResults: 50,
            name: name,
            orderBy: "OBJECT_NUMBER",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(`cypress/fixtures/${envValue}-objectDetails.json`, response.body);
    });
});

Cypress.Commands.add("getObjectDetailsByIMO", (authToken, imo) => {
    imo = imo || "0";
    cy.api({
        url: api.baseEndpoint + "objects",
        method: "GET",
        qs: {
            maxResults: 5,
            imoNumber: imo,
            orderBy: "OBJECT_NUMBER",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        }
    });
});

Cypress.Commands.add("updateObjectDetailsByIMO", (authToken, imo, body) => {
    imo = imo || "0";
    cy.api({
        url: api.baseEndpoint + "objects",
        method: "PUT",
        body: body,
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        expect(response.status).to.eq(200);
    });
});

Cypress.Commands.add("getObjectDetailsSortedByIMO", (envValue, authToken) => {
    cy.request({
        url: api.baseEndpoint + "objects",
        method: "GET",
        qs: {
            maxResults: 20,
            types: "VESSEL_1",
            orderBy: "IMO_NUMBER",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(`cypress/fixtures/${envValue}-objectDetailsSortedByIMO.json`, response.body);
    });
});

// Checking API Endpoint
Cypress.Commands.add("getAgreementDetails", (envValue, authToken, name) => {
    name = name || "Add Product %";
    cy.request({
        url: api.baseEndpoint + "agreements",
        method: "GET",
        qs: {
            maxResults: 20,
            name: name,
            orderBy: "AGREEMENT_ID",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-agreementDetails.json`,
            response.body
        );
    });
}
);

Cypress.Commands.add("getEstablishedAgreementDetails", (envValue, authToken) => {
    cy.request({
        url: api.baseEndpoint + "agreements",
        method: "GET",
        qs: {
            maxResults: 20,
            status1: "ESTABLISHED_E",
            orderBy: "AGREEMENT_ID",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-establishedAgreementDetails.json`,
            response.body
        );
    });
});



Cypress.Commands.add("createClaimByAPI", (token, jsonFile) => {
    jsonFile = jsonFile || "createClaim-other";
    const date = getCurrentDateFormatted("YYYY-MM-DD");
    const { envValue } = Cypress.env();
    cy.fixture(`${envValue}-${jsonFile}.json`).then((data) => {
        data.text = `${date} Creating a Claim`;
        data.created = date;
        data.lastUpdated = date;
        // data.date = date;
        data.reportedDate = date;
        // data.codeDate = date;
        data.lastTreatmentDate = date;
        data.codeDate = date;
        // data.exchangeDateForAutoDeductibles = date;
        // data.codeTreatmentDate = date;
        // data.enrollmentDate = date;
        cy.request({
            url: api.baseEndpoint + "claims",
            method: "POST",
            body: data,
            headers: {
                Authorization: token,
            },
            timeout: 70000,
        }).then((response) => {
            expect(response.status).to.equal(200);
            console.log(response.body);
            return response.body;
        });
    });
});

Cypress.Commands.add("getLegalPersonDetails", (envValue, authToken, types, text) => {
    types = types || "CUSTOMER_DIR_5";
    text = text || "Legal Person %";
    cy.request({
        url: api.baseEndpoint + "persons",
        method: "GET",
        qs: {
            maxResults: 5,
            types: types,
            fullText: text,
            orderBy: "ID",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-legalPersonDetails.json`,
            response.body
        );
    });
});

Cypress.Commands.add("getOrgDetails", (envValue, authToken, types, orgNo) => {
    types = types || "CUSTOMER_DIR_5";
    orgNo = orgNo || "%";
    cy.request({
        url: api.baseEndpoint + "persons",
        method: "GET",
        qs: {
            maxResults: 10,
            types: types,
            orgNo: orgNo,
            orderBy: "ORG_NO",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-orgDetails.json`,
            response.body
        );
    });
});

Cypress.Commands.add("getOrgDetailsBySSN", (envValue, authToken, types, ssn) => {
    types = types || "CUSTOMER_DIR_5";
    ssn = ssn || "[0-9]%";
    cy.request({
        url: api.baseEndpoint + "persons",
        method: "GET",
        qs: {
            maxResults: 20,
            types: types,
            ssn: ssn,
            orderBy: "ID",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-orgWithSSNDetails.json`,
            response.body
        );
    });
});

Cypress.Commands.add("getPersonWithInsurances", (envValue, authToken, types) => {
    types = types || "CUSTOMER_DIR_5";
    cy.request({
        url: api.baseEndpoint + "persons",
        method: "GET",
        qs: {
            firstResult: 0,
            maxResults: 1,
            types: types,
            hasInsurancesOnly: true
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-personWithInsurances.json`,
            response.body
        );
    });
});

Cypress.Commands.add("createPerson", (authToken, personDetail = {}) => {
        cy.request({
        url: api.baseEndpoint + "persons",
        method: "POST",
        body: personDetail,
        headers: {
            Authorization: authToken,
        },
    }).then((request, response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

Cypress.Commands.add("getUserDetails", (envValue, authToken, name, email) => {
    name = name || "%";
    email = email || "%";
    cy.request({
        url: api.baseEndpoint + "users",
        method: "GET",
        qs: {
            maxResults: 20,
            name: name,
            email: email,
            orderBy: "ID",
            orderByDirection: "ASC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-userDetails.json`,
            response.body
        );
    });
});

Cypress.Commands.add("getUserDetailsBySSN", (envValue, authToken, ssn) => {
    ssn = ssn || "123456789";
    cy.request({
        url: api.baseEndpoint + "users",
        method: "GET",
        qs: {
            maxResults: 20,
            ssn: ssn,
            orderBy: "ID",
            orderByDirection: "ASC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-userDetailsBySSN.json`,
            response.body
        );
    });
});

Cypress.Commands.add("getOfferAgreementDetails", (envValue, authToken, name) => {
    name = name || "%";
    cy.request({
        url: api.baseEndpoint + "offermarine/agreements",
        method: "GET",
        qs: {
            maxResults: 20,
            name: name,
            agreementTypes: "MARINE_1",
            orderBy: "AGREEMENT_ID",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-offerAgreementDetails.json`,
            response.body
        );
    });
});

Cypress.Commands.add("getOfferAgreementDetailsByYear", (envValue, authToken, year) => {
    cy.request({
        url: api.baseEndpoint + "offermarine/agreements",
        method: "GET",
        qs: {
            maxResults: 500,
            year: year,
            orderBy: "AGREEMENT_ID",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-offerAgreementDetails.json`,
            response.body
        );
    });
});

Cypress.Commands.add("getOfferSubmissionDetails", (envValue, authToken, id) => {
    cy.request({
        url: api.baseEndpoint + "offermarine/submissions",
        method: "GET",
        qs: {
            offerMarineAgreementId: id
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-offerSubmissionDetails.json`,
            response.body
        );
    });
});

Cypress.Commands.add("getOfferSectionDetails", (authToken, id) => {
    cy.request({
        url: api.baseEndpoint + "offermarine/sections",
        method: "GET",
        qs: {
            offerMarineAgreementId: id
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("createOfferMarineProductByAPI", (authToken) => {
    cy.fixture("offer-section-body.json").then((data) => {
        cy.request({
            url: api.baseEndpoint + "offermarine/sections",
            method: "POST",
            headers: {
                Authorization: authToken,
            },
            body: data
        }).then((response) => {
            return response.body;
        });
    });

});

Cypress.Commands.add("deleteOfferMarineProductByAPI", (authToken, id) => {
    cy.request({
        url: api.baseEndpoint + `offermarine/sections/${id}`,
        method: "DELETE",
        headers: {
            Authorization: authToken,
        }
    }).then((response) => {
        expect(response.status).to.eq(204); // Verify the product is deleted successfully
    });
});


//Create a new Role-Offer
Cypress.Commands.add("createOfferRoleByAPI", (authToken, agreementId) => {
    //console.log(agreementId)
    cy.fixture("offer-role-body.json").then((data) => {
        cy.request({
            url: api.baseEndpoint + `agreements/${agreementId}/roles`,
            method: "POST",
            /*qs: {
                id: agreementId
            },*/
            headers: {
                Authorization: authToken,
            },
            body: data
        }).then((response) => {
            return response.body;
        });
    });

});

Cypress.Commands.add("getAndReturnOfferSubmissionDetails", (authToken, id) => {
    cy.request({
        url: api.baseEndpoint + "offermarine/submissions",
        method: "GET",
        qs: {
            offerMarineAgreementId: id
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return cy.wrap(response.body);
    });
});

Cypress.Commands.add("getFleetDetails", (authToken, name) => {
    name = name || "Automated Fleet %";
    cy.request({
        url: api.baseEndpoint + "fleetmarine",
        method: "GET",
        qs: {
            maxResults: 20,
            name: name,
            orderBy: "ID",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getFleetDetailsById", (envValue, authToken, id) => {
    cy.request({
        url: api.baseEndpoint + `fleetmarine/${id}`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-${id}Detail.json`,
            response.body
        );
    });
});

Cypress.Commands.add("getFleetRoles", (authToken, fleetId) => {
    cy.request({
        url: api.baseEndpoint + `fleetmarine/${fleetId}/roles`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("updateFleetRoles", (authToken, fleetId, roleData) => {
    roleData = roleData || [];
    cy.request({
        url: api.baseEndpoint + `fleetmarine/${fleetId}/roles`,
        method: "POST",
        body: roleData,
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        expect(response.status).to.eq(200);
        return response.body;
    });
});

Cypress.Commands.add("getFleetObjects", (authToken, fleetId) => {
    cy.request({
        url: api.baseEndpoint + `fleetmarine/${fleetId}/objects`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("disconnectFleetObjects", (authToken, fleetId, objectIDs) => {
    cy.request({
        url: api.baseEndpoint + `fleetmarine/${fleetId}/disconnectobjects`,
        method: "POST",
        body: objectIDs,
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("connectFleetObjects", (authToken, fleetId, objectIDs) => {
    cy.request({
        url: api.baseEndpoint + `fleetmarine/${fleetId}/connectobjects`,
        method: "POST",
        body: objectIDs,
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getSupportRequests", (authToken) => {
    cy.request({
        url: Cypress.env().cloudAPI.endpoint + "support",
        method: "GET",
        headers: {
            Authorization: "Bearer " + authToken,
        }
    }).then((response) => {
        const numOfItems = response.body.Collection.length;
        const support = response.body.Collection[Math.floor(Math.random() * numOfItems)];
        return support;
    });
});

Cypress.Commands.add("getElectronicPaymentDetails", (envValue, authToken) => {
    cy.request({
        url: api.baseEndpoint + "/electronicremittance/countersign",
        method: "GET",
        qs: {
            maxResults: 20,
            signature: "WEA"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-electronicPaymentDetails.json`,
            response.body
        );
    });
});

Cypress.Commands.add("getClaimPaymentDetails", (envValue, authToken) => {
    cy.request({
        url: api.baseEndpoint + "/claimtransactions",
        method: "GET",
        qs: {
            maxResults: 20
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-claimPaymentDetails.json`,
            response.body
        );
    });
});

Cypress.Commands.add("getClaimPaymentDetailsByStatus", (envValue, authToken, status) => {
    const predefinedStatus = ["TAKEN_10", "NOT_USED_11", "DRAFT_12", "HOLD_13"
        , "RELEASE_14", "WAIT_FOR_SIGN_15"];
    const newArray = replaceCharsInArray(predefinedStatus, "_", "");
    status = removeAllSpace(status.toUpperCase());
    const index = findIndexContaining(newArray, status);
    cy.request({
        url: api.baseEndpoint + "/claimtransactions",
        method: "GET",
        qs: {
            maxResults: 20,
            claimTransactionStatuses: predefinedStatus[index]
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        cy.writeFile(
            `cypress/fixtures/${envValue}-claimPaymentDetailsByStatus.json`,
            response.body
        );
    });
});

Cypress.Commands.add("getClaimPlaces", (authToken) => {
    cy.request({
        url: api.baseEndpoint + "systemcodes/claimcodes/claimplaces",
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getClaimCodeProcesses", (authToken) => {
    cy.request({
        url: api.baseEndpoint + "systemcodes/claimcodes/processes",
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getClaimCodePAndIClaimTypes", (authToken, coverageId) => {
    cy.request({
        url: api.baseEndpoint + "systemcodes/claimcodes/pandiclaimtypes",
        method: "GET",
        qs: {
            coverageId: coverageId,
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getPAndIClaimTypes", (authToken, claimID) => {
    cy.request({
        url: api.baseEndpoint + `claims/${claimID}/subclaims/pandiclaimtypes`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getSubClaimDeductibleHeaders", (authToken, subClaimID) => {
    cy.request({
        url: api.baseEndpoint + `claims/subclaims/${subClaimID}/deductibleheaders/sums`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getPAndIDeductibleCodes", (authToken, coverageId) => {
    cy.request({
        url: api.baseEndpoint + "claims/subclaims/deductiblecodes",
        method: "GET",
        qs: {
            coverageId: coverageId,
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getDetailCasualties", (authToken, coverageId, pAndIClaimType) => {
    cy.request({
        url: api.baseEndpoint + "systemcodes/claimcodes/detailcasualties",
        method: "GET",
        qs: {
            coverageId: coverageId,
            pandIClaimType: pAndIClaimType,
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getRuleOfCoverCodes", (authToken, coverageId, deductibleCode) => {
    cy.request({
        url: api.baseEndpoint + `claims/subclaims/ruleofcovercodes/${deductibleCode}`,
        method: "GET",
        qs: {
            coverageId: coverageId,
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getClaimRoleTypes", (authToken) => {
    cy.request({
        url: api.baseEndpoint + "roles/roletype",
        method: "GET",
        qs: {
            roleDomainType: "CLAIM",
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getClaimCategories", (authToken, coverageId) => {
    cy.request({
        url: api.baseEndpoint + "systemcodes/claimcodes/claimcategories",
        method: "GET",
        qs: {
            coverageId: coverageId,
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getFormsOfGuarantees", (authToken) => {
    cy.request({
        url: api.baseEndpoint + "constants/CLAIM_GUARANTEE_FORM_OF_GUARANTEE",
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getGuaranteesOfClaim", (authToken, claimID) => {
    cy.request({
        url: api.baseEndpoint + `claims/${claimID}/guarantees`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getEnergyCauseCodes", (authToken, coverageId) => {
    cy.request({
        url: api.baseEndpoint + `/systemcodes/claimcodes/energycausecodes`,
        method: "GET",
        qs: {
            coverageId: coverageId,
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getMainCasualties", (authToken, coverageId, energyCauseCode, mainEvent) => {
    cy.request({
        url: api.baseEndpoint + `/systemcodes/claimcodes/maincasualties`,
        method: "GET",
        qs: {
            coverageId: coverageId,
            energyCauseCode: energyCauseCode,
            mainEvent: mainEvent
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getMainCasualtiesBySuperEvent", (authToken, coverageId, superEvent) => {
    cy.request({
        url: api.baseEndpoint + `/systemcodes/claimcodes/maincasualties`,
        method: "GET",
        qs: {
            coverageId: coverageId,
            superEvent: [superEvent],
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getClaimInterestEnergyCodes", (authToken, coverageId, casualty) => {
    cy.request({
        url: api.baseEndpoint + `/systemcodes/claimcodes/claiminterestenergycodes`,
        method: "GET",
        qs: {
            coverageId: coverageId,
            casualty: casualty
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getNonMarineClaimEffects", (authToken, coverageId, claimInterestEnergyCode) => {
    cy.request({
        url: api.baseEndpoint + `/systemcodes/claimcodes/nonmarineclaimeffects`,
        method: "GET",
        qs: {
            coverageId: coverageId,
            claimInterestEnergyCode: claimInterestEnergyCode
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getSubClaims", (authToken, claimId) => {
    cy.request({
        url: api.baseEndpoint + `claims/${claimId}/subclaims/`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body.result;
    });
});

Cypress.Commands.add("getSubClaimDetails", (authToken, subClaimId) => {
    cy.request({
        url: api.baseEndpoint + `claims/subclaims/${subClaimId}`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getRoleTypes", (authToken, roleDomainType) => {
    cy.request({
        url: api.baseEndpoint + "roles/roletype",
        method: "GET",
        qs: {
            roleDomainType: roleDomainType,
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getInternalRolesOfClaim", (authToken, claimID) => {
    cy.request({
        url: api.baseEndpoint + `claims/${claimID}/internalroles`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getCommonCodes", (authToken, type, pAndIClaimType = "") => {
    cy.request({
        url: api.baseEndpoint + `systemcodes/commoncodes`,
        method: "GET",
        qs: {
            type: type,
            pandIClaimType: pAndIClaimType,
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getInterests", (authToken, agreementID) => {
    cy.request({
        url: api.baseEndpoint + `systemcodes/businessbreakdown/interests`,
        method: "GET",
        qs: {
            agreementId: agreementID
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getBusinessBranches", (authToken, agreementType) => {
    cy.request({
        url: api.baseEndpoint + `systemcodes/businessbreakdown/busnbranches`,
        method: "GET",
        qs: {
            agreementType: agreementType,
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getBusinessSections", (authToken, agreementType, businessDivision) => {
    cy.request({
        url: api.baseEndpoint + `systemcodes/businessbreakdown/busnsections`,
        method: "GET",
        qs: {
            agreementType: agreementType,
            busnDivision: businessDivision
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getBusinessClasses", (authToken, agreementType, businessSection, businessDivision) => {
    businessSection = businessSection || null;
    businessDivision = businessDivision || null;
    cy.request({
        url: api.baseEndpoint + `systemcodes/businessbreakdown/busnclasses`,
        method: "GET",
        qs: {
            agreementType: agreementType,
            busnSection: businessSection,
            busnDivision: businessDivision
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getBusinessRegions", (authToken, businessBranch) => {
    cy.request({
        url: api.baseEndpoint + `systemcodes/businessbreakdown/busnregions`,
        method: "GET",
        qs: {
            busnBranch: businessBranch
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getUnderwritingTeams", (authToken) => {
    cy.request({
        url: api.baseEndpoint + `systemcodes/businessbreakdown/underwritingteams`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getBusinessTeams", (authToken) => {
    cy.request({
        url: api.baseEndpoint + `systemcodes/businessbreakdown/teams`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getBusinessDivisions", (authToken, agreementType) => {
    agreementType = agreementType || "NON_MARINE_7";
    cy.request({
        url: api.baseEndpoint + `systemcodes/businessbreakdown/busndivisions`,
        method: "GET",
        qs: {
            agreementType: agreementType
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getOffices", (authToken) => {
    cy.request({
        url: api.baseEndpoint + `systemcodes/businessbreakdown/offices`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getClaimSuperEvents", (authToken) => {
    cy.request({
        url: api.baseEndpoint + `constants`,
        qs: {
            constantTypes: ["CLAIM_EVENT_SUPER_EVENT"]
        },
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getClaimMainEvents", (authToken, superEvent) => {
    cy.request({
        url: api.baseEndpoint + `systemcodes/claimcodes/mainevents`,
        qs: {
            superEvent: superEvent
        },
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getClaimAreaCodes", (authToken) => {
    cy.request({
        url: api.baseEndpoint + `systemcodes/geographiccodes/areacodes`,
        qs: {
            type: ["CLAIM_AREA"]
        },
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getClaimPaymentCodes", (authToken, coverageId) => {
    cy.request({
        url: api.baseEndpoint + `systemcodes/claimcodes/paymentcodes`,
        qs: {
            coverageId: coverageId
        },
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getUserNotifications", (authToken) => {
    cy.request({
        url: api.baseEndpoint + "usernotifications",
        qs: {
            firstResult: 0,
            maxResults: 10,
            orderBy: "ID",
            orderByDirection: "DESC"
        },
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("deleteClaim", (authToken, claimId) => {
    cy.request({
        url: api.baseEndpoint + `claim/${claimId}/delete`,
        qs: {
            id: claimId
        },
        method: "POST",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        expect(response.status).to.equal(200);
    });
});

Cypress.Commands.add("generateSSN", () => {
    cy.request({
        url: "https://ra-preprod.bankidnorge.no/api/enduser?sex=male",
        method: "GET",
        qs: {
            sex: "male"
        }
    }).then((response) => {
        const { value } = response.body;
        return cy.wrap(value);
    });
});

Cypress.Commands.add("updatePassword", (access_token, id, password,) => {
    cy.request({
        url: Cypress.config('baseUrl') + "/api/paris/plugin",
        method: "POST",
        qs: {
            plugin: "UpdatePasswordByAdmin",
        },
        body: {
            "id": id,
            "password": password
        },
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
    });
});

Cypress.Commands.add("getGeographicCode", (authToken, type, code) => {
    type = type || "COUNTRY_CODE"
    code = code || "NOR"
    cy.request({
        url: api.baseEndpoint + `systemcodes/geographiccodes/areacodes`,
        qs: {
            firstResult: 0,
            type: type,
            code: code
        },
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getCoverageId", (authToken, currentDate) => {
    cy.api({
        url: api.baseEndpoint + `coveragedeclaration`,
        method: "GET",
        qs: {
            firstResult: 0,
            maxResults: 5,
            validPerDate: currentDate,
            orderBy: "COVERAGE_ID",
            orderByDirection: "DESC"
        },
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getCoverageDetail", (authToken, coverageId) => {
    cy.api({
        url: api.baseEndpoint + `coverages/${coverageId}`,
        method: "GET",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        return response.body;
    });
});

Cypress.Commands.add("getAllAttachments", (authToken, type, id) => {
    cy.request({
        url: Cypress.config('baseUrl') + "/api/paris/plugin",
        method: "GET",
        qs: {
            plugin: "GetAllAttachments",
            "search[GetLocalAttachment]": true,
            "search[AttachmentKey]": id,
            "search[AttachmentType]": type
        },
        headers: {
            Authorization: authToken
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
        return response.body.data;
    });
});

Cypress.Commands.add("getDocumentArchives", (authToken, type, id) => {
    cy.request({
        url: Cypress.config('baseUrl') + "/api/paris/plugin",
        method: "GET",
        qs: {
            plugin: "GetDocumentArchives",
            "search[limit]": 10,
            "search[page]": 1,
            "search[draw]": 1,
            "search[EntityKey]": id,
            "search[EntityType]": type,
            "search[FormTypes][0]": "ATTACHMENT_AT"
        },
        headers: {
            Authorization: authToken
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
        return response.body.data.TotalCount;
    });
});

/**
 * @returns:
        "Collection": [
            {
                "AgreementName": null,
                "AgreementNumber": null,
                "ApprovalStatus": "TO_BE_APPROVED_T",
                "Approved": null,
                "ApprovedBy": null,
                "ByExternal": false,
                "CanView": true,
                "Category": "ABC",
                "Created": "2025-01-13T06:26:21.358000",
                "CreatedBy": "WEB",
                "CreatedDate": null,
                "Description": "multi",
                "DisplayName": null,
                "DocumentMetadata": null,
                "DocumentNumber": 0,
                "DocumentSignatureStatus": "SIG_NOT_REQ_N",
                "Electronic": true,
                "Employee": null,
                "ExternalId": null,
                "FolderId": null,
                "FormType": "ATTACHMENT_AT",
                "Id": 110451,
                "InsuredObjectName": "Dummy Vessel 2025-01-05 933952",
                "InsuredObjectNumber": 37204,
                "Interests": [],
                "LastUpdated": "2025-01-13T06:26:21.358000",
                "LastUpdatedBy": "WEB",
                "MimeSubType": null,
                "MimeType": null,
                "Name": "license.txt",
            },            
        ],
 */
Cypress.Commands.add("getDocumentArchiveData", (authToken, type, id) => {
    cy.request({
        url: Cypress.config('baseUrl') + "/api/paris/plugin",
        method: "GET",
        qs: {
            plugin: "GetDocumentArchives",
            "search[limit]": 10,
            "search[page]": 1,
            "search[draw]": 1,
            "search[EntityKey]": id,
            "search[EntityType]": type,
            "search[FormTypes][0]": "ATTACHMENT_AT"
        },
        headers: {
            Authorization: authToken
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
        return response.body.data.Collection;
    });
});

Cypress.Commands.add("cancelAttachment", (authToken, attachmentId) => {
    cy.request({
        url: Cypress.config('baseUrl') + "/api/paris/plugin",
        method: "POST",
        qs: {
            plugin: "DeleteAttachment",
        },
        body: {
            "id": attachmentId,
        },
        headers: {
            Authorization: authToken
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
    });
});

Cypress.Commands.add("deleteAttachmentPermanently", (authToken, attachmentId) => {
    cy.request({
        url: Cypress.config('baseUrl') + "/api/paris/plugin",
        method: "POST",
        qs: {
            plugin: "DeleteAttachmentPermanently",
        },
        body: {
            "id": attachmentId,
        },
        headers: {
            Authorization: authToken
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
    });
});

Cypress.Commands.add("searchNewsChannel", (authToken) => {
    cy.request({
        url: Cypress.config('baseUrl') + "/api/paris/plugin",
        method: "GET",
        qs: {
            plugin: "SearchNewsPublishing",
            client: "noria",
            _rx: 1,
            search: {
                "limit": 10,
                "page": 1,
                "draw": 1
            }
        },
        headers: {
            Authorization: authToken
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
        return response.body;
    });
});

Cypress.Commands.add("createNewsChannel", (authToken, channelName, url) => {
    cy.request({
        url: Cypress.config('baseUrl') + "/api/paris/plugin",
        method: "POST",
        qs: {
            plugin: "SaveNewsPublishing",
        },
        body: {
            "Body": {
                "Name": channelName,
                "PreviewLink": url
            }
        },
        headers: {
            Authorization: authToken
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
    });
});

Cypress.Commands.add("createNewsChannel", (authToken, channelName, url) => {
    cy.request({
        url: Cypress.config('baseUrl') + "/api/paris/plugin",
        method: "POST",
        qs: {
            plugin: "SaveNewsPublishing",
        },
        body: {
            "Body": {
                "Name": channelName,
                "PreviewLink": url
            }
        },
        headers: {
            Authorization: authToken
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
    });
});

Cypress.Commands.add("getRequest", (authToken, url, queryParameters) => {
    queryParameters = queryParameters || null;
    cy.api({
        url: api.baseEndpoint + url,
        method: "GET",
        qs: queryParameters,
        headers: {
            Authorization: authToken,
        },
    });
});

Cypress.Commands.add("putRequest", (authToken, url, bodyData) => {
    cy.api({
        url: api.baseEndpoint + url,
        method: "PUT",
        body: bodyData,
        headers: {
            Authorization: authToken,
        },
    });
});

Cypress.Commands.add("postRequest", (authToken, url, bodyData) => {
    cy.api({
        url: api.baseEndpoint + url,
        method: "POST",
        body: bodyData,
        headers: {
            Authorization: authToken,
        },
    });
});

Cypress.Commands.add("logIntoPortal", (username, password, delay = 3000) => {
    cy.visit(portal.url + "/backoffice");
    loginPage.getUsername().clear().type(username);
    loginPage.getPassword().clear().type(password);
    loginPage.getLoginButton().click();
    cy.wait(delay);
    /**
     * Adding URL check to bypass the issue that system sometime does not load the dashboard page 
     * after clicking on Log In button 
     */
    cy.url().then(url => {
        if (!url.includes("dashboard")) {
            loginPage.getUsername().clear().type(username);
            loginPage.getPassword().clear().type(password);
            loginPage.getLoginButton().click();
            cy.wait(delay);
        }
    });
    // cy.pageLoading();
    cy.waitForPageLoaded();
});

Cypress.Commands.add("logIntoPortalWithSession", (username, password, clientId) => {
    clientId = clientId || api.client_id;
    cy.session(username, () => {
        /*************** API Log In ****************/
        cy.logIntoPortalByApi(username, password, clientId).then(
            (access_token) => {
                Cypress.env("user_access_token", `Bearer ${access_token}`);
            }); 
    });
});

Cypress.Commands.add("logIntoPortalByApi", (username, password, clientId) => {
    clientId = clientId || api.client_id;
    cy.api({
        url: "/api/session/tokens",
        method: "GET",
        qs: {
            client_id: clientId,
        },
    }).then(() => {
        cy.getAllCookies().then(() => {
            cy.api({
                url: "/api/auth/token",
                method: "POST",
                qs: {
                    language: "en-GB",
                },
                body: {
                    "client_id": clientId,
                    "grant_type": "password",
                    "username": username,
                    "password": password
                },
            }).then((response) => {
                // console.log("Post TOKEN with username & password");
                // window.localStorage.setItem('access_token', response.body.access_token);
                // Cypress.env("access_token", response.body.access_token);
                return response.body.access_token;
            });
        });
    });
});

Cypress.Commands.add("logOutEndPoint", (cookie, clientId = api.client_id) => {
    cy.api({
        url: "/api/session/logout",
        method: "POST",
        qs: {
            //     plugin: "Logout",
            //     option: "com_ajax",
            //     group: "noria",
            //     format: "raw",
            //     lang: "en"
            client_id: clientId,
        },
        headers: {
            // ":authority:": "clouddev.noriacloud.com",
            // Cookie: `NoriaSessionId=${cookie}`
            // "Content-Type": "application/json",
            // "Authorization": "Bearer " + cookie
        },
    }).then((response) => {
        expect(response.status).to.equal(200);
    });
});

/**
 * @desc: Using the following code to log out using API
 */
Cypress.Commands.add("logOutFromPortal", () => {
    /****** Log out by Access Token
        cy.window().then((win) => {
        var localStorageValue = "";
        Object.entries(win.localStorage).forEach(entry => { 
            const [key, value] = entry;
            if (key.includes("ams.accessToken")) {
                localStorageValue = value.replaceAll("\"", "");
                // console.log("Access Token:", value);
            }
        });
        cy.logOutEndPoint(localStorageValue.replace("\"", ""));
    }); 
    *******************************/
    /*********************************************************
     * @desc: Using the following code to log out with cookies
     */
    cy.getAllCookies().then((cookies) => {
        // console.log(cookies);
        var cookiesValue = "";
        Object.entries(cookies).forEach(entry => {
            const [key, value] = entry;
            cookiesValue += value.name + "=" + value.value + ";";
        });
        // console.log("Cookies value", cookiesValue);
        cy.logOutEndPoint(cookiesValue);
    });
    //*/
});

Cypress.Commands.add("logOutFromPortalByUI", () => {
    header.getUserSettingButton().click({ force: true });
    cy.wait(800);
    cy.contains("Logout").click({ force: true });
    cy.get(`${commonElements.confirmDialogSelector}:visible`).within(() => {
        cy.get(`${commonElements.buttonSelector}[title='Confirm']:visible`).click({ force: true });
    });
    cy.wait(1000);
});

Cypress.Commands.add("verifyLoggedInUser", (username) => {
    header.getUserSettingButton().click({ force: true });
    cy.wait(800);
    cy.contains(username).should("be.visible");
    cy.wait(200);
});

Cypress.Commands.add("logIntoAdminHub", (username, password) => {
    cy.visit(adminHub.url);
    loginPage.getUsername().type(username);
    loginPage.getPassword().type(password);
    loginPage.getLoginButton().click();
});

Cypress.Commands.add("pageLoading", (stopper = 5, counter = 0) => {
    cy.get("body").then((body) => {
        if (body.children(commonElements.spinnerContainer).length) {
            let spinner = body.find(`${commonElements.spinnerContainer} ${commonElements.spinner}`);
            if (spinner.is(":visible") && counter < stopper) {
                counter = counter + 1;
                cy.log(`Stopper: ${stopper} - Counter: ${counter} - Dashboard is loading ....`);
                cy.wait(1000);
                cy.pageLoading(stopper, counter);
            }
        }
    });
});

Cypress.Commands.add("waitForPageLoaded", (counter = 0) => {
    cy.get(commonElements.loadingBar)
        .invoke("attr", "style").then((text) => {            
            counter = counter + 1;
            if (text !== "width: 0%;" && counter <= 10) {
                cy.log("Counter: " + counter);
                cy.log("Loading ... ... ... ... ...");
                cy.wait(500);
                cy.waitForPageLoaded(counter);
            }
        });
});

Cypress.Commands.add("__waitForPageLoaded", (counter = 0) => {
    cy.get(commonElements.mainContainer).then((mainContainer) => {
        let elements = mainContainer.children(commonElements.loadingContainer);
        console.log(`Number of Loading Bar: ${elements.length}`);
        if (elements.length) {
            cy.get(commonElements.loadingBar).then(loading => {
                if (loading.is(":visible")   ){
                    cy.log("Loading ... ... ... ... ...");
                    cy.wait(200);
                    cy.waitForPageLoaded(counter);
                } else {
                    cy.log("Page is completedly loaded!!!!!!!!!!!!!");
                }
            });
        } else {
            cy.log("NO LOADING BARRRRRRR");
        }
    });
});

Cypress.Commands.add("waitForElementVisible", (selector, second = 20000) => {
    return cy.get(selector, { timeout: second }).should("be.visible");
});

Cypress.Commands.add("waitForUploadCompleted", (counter = 0) => {
    cy.get(commonElements.uploadingProgressBar).last()
        .invoke("attr", "style").then((text) => {
            cy.wait(1000);
            if (text !== "width:0" && counter <= 5) {
                counter = counter + 1;
                cy.wait(1000);
                cy.waitForUploadCompleted(counter);
            }
        });
    cy.waitForPageLoaded();
    cy.get(commonElements.uploadWidgetSection).then((uploadSection) => {
        if (uploadSection.find(commonElements.pendingFile).length && counter <= 5) {
            counter = counter + 1;
            cy.waitForUploadCompleted(counter);
        }
    });
    // Check if any error
    cy.get(`${commonElements.toastContainerSelector}`).then(($popUpContainer) => {
        let $popUp = $popUpContainer.find(commonElements.popUpMessageSelector);
        if ($popUp.length > 0 && $popUp.is(":visible")) {
            let headerPopUp = $popUp.find(commonElements.titleSelector).text();
            let messagePopUp = $popUp
                .find(commonElements.messageTextSelector).text().trim().toLowerCase();
            if (headerPopUp.includes("Error")) {
                assert.isFalse(true, messagePopUp);
            }
        }
    });
});

/**
 * @description is used to click CONFIRM or COPY button from the dialog popUp
 */
// Moved to DialogElements.js
Cypress.Commands.add("confirmDialog", () => {
    cy.get(`${commonElements.confirmDialogSelector}:visible`).within(() => {
        cy.get(commonElements.confirmButton).click().wait(1000);
    });
});

// Moved to DialogElements.js
Cypress.Commands.add("closeDialog", () => {
    cy.get(`${commonElements.confirmDialogSelector}:visible`).within(() => {
        cy.get(commonElements.closeButton).click().wait(1000);
    });
});

/*
    Handling the Javascript Alert, Confirmation and Prompt    
    https://testersdock.com/cypress-javascript-alert-confirm-prompt/
*/
Cypress.Commands.add("confirmJSConfirmation", () => {
    cy.on("window:confirm", () => true);
});

Cypress.Commands.add("cancelJSConfirmation", () => {
    cy.on("window:confirm", () => false);
});

Cypress.Commands.add("inputValueForTextArea", (label = "", value) => {
    cy.get("textarea:visible").then(($element) => {
        // 2023-01-10 - Will check the case that having more than 1 TextArea element on page
        if ($element.length > 1) {
            for (let index = 0; index < $element.length; index++) {
                // If the placeholder attribute is existed or not
                let attrValue = $element.get(index).getAttribute("placeholder");
                if (typeof attrValue !== "undefined" && attrValue !== false) {
                    if (label != "") {
                        cy.wrap($element.get(index)).invoke("attr", "placeholder").then((text) => {
                            if (text.includes(label)) {
                                cy.wrap($element.get(index)).clear().type(value);
                                return false;
                            }
                        });
                    }
                }
            }
        }
        if ($element.length === 1) {
            cy.get("textarea:visible").clear().type(value);
        }
    });
    cy.wait(500);
});

/** 
 * @description: Find input by label (exact match using RegExp)
 */
Cypress.Commands.add("getInputElement", (label) => {
    cy.get("label > span").contains(new RegExp("^" + label + "$", "g"))
        .then(($element) => {
            const inputs = $element.parent("label").parent("div").find("input").length;
            return $element.parent("label").parent("div").find("input").attr("id");
        })
        .then((id) => {
            cy.get(`input[id='${id}']`).as("input").then((ele) => {
                ele.css("color", "red");
            });
            return cy.get("@input");
        });
});

Cypress.Commands.add("getLastInputElement", (label) => {
    cy.get("label > span").contains(new RegExp("^" + label + "$", "g"))
        .then(($element) => {
            return $element.parent("label").parent("div").find("input:visible");
        }).then((ids) => {
            return ids;
        });
});

Cypress.Commands.add("getElementBy", (label) => {
    cy.get("label > span:visible").contains(new RegExp("^" + label + "$", "g"))
        .then(($element) => {
            let childrenElement = $element.parent("label").parent("div").find(":not(div):not(label):not(span)");
            return childrenElement.attr("id");
        })
        .then((id) => {
            cy.get(`[id='${id}']`).as("element").then((ele) => {
                ele.css("color", "red");
            });
            return cy.get("@element");
        });
});

Cypress.Commands.add("getSelectElement", (label) => {
    cy.get("label > span").contains(new RegExp("^" + label + "$", "g"))
        .then(($element) => {
            // const inputs = $element.parent("label").parent("div").find("select").length;
            return $element.parent("label").parent("div").find("select").attr("id");
        })
        .then((id) => {
            cy.get(`select[id='${id}']`).as("selectElement").then((ele) => {
                ele.css("color", "red");
            });
            return cy.get("@selectElement");
        });
});

Cypress.Commands.add("getElementTagByLabel", (label) => {
    cy.get("label > span:visible").contains(new RegExp("^" + label + "$", "g"))
        .then(($element) => {
            let childrenElement = $element.parent("label").parent("div").find(":not(div):not(label):not(span)").get();
        });
});

Cypress.Commands.add("getBoTextEditor", (label) => {
    cy.get("label > span").contains(new RegExp("^" + label + "$", "g"))
        .then(($element) => {
            return $element.parent("label").parent("div").find(commonElements.boTextEditorSelector);
        });
});

Cypress.Commands.add("inputOrSelectValue", (label, value) => {
    cy.get("label > span:visible").contains(new RegExp("^" + label + "$", "g"))
        .then(($element) => {
            let childrenElement = $element.parent("label").parent("div").find(":not(div):not(label):not(span)").get();
            let newArray = [];
            childrenElement.forEach((element) => newArray.push(element.nodeName));
            return newArray.toString();
        })
        .then((tagList) => {
            tagList.includes("SELECT")
                ? cy.selectValue(label, value)
                : cy.inputValue(label, value);
        });
});

/**
 * @description Input value (or clear default value) for input element by label
 * @param {string} label
 * @param {string} value
 */
Cypress.Commands.add("inputValue", (label, value) => {
    (value !== "" && value !== undefined)
        ? cy.getInputElement(label).wait(500).clear().type(value)
        : cy.getInputElement(label).wait(500).clear().realPress("Tab");
    cy.wait(500);
});

Cypress.Commands.add("inputTextEditor", (label, value) => {
    cy.getBoTextEditor(label).then(editor => {
        cy.wrap(editor).find(commonElements.textEditorSelector).wait(500).clear().type(value);
        cy.wait(500);
    });
});

Cypress.Commands.add("getInputtedValue", (label) => {
    cy.getInputElement(label).then((ele) => {
        const val = ele.get(0).value;
        return cy.wrap(val);
    });
});

Cypress.Commands.add("getInputtedValueFromDialog", (label) => {
    cy.get(dialog.cdkOverlayContainerSelector).then(() => {
        cy.get(`${dialog.dialogSectionSelector}:visible`).then(() => {
            cy.getInputtedValue(label);
        });
    });
});

Cypress.Commands.add("getSelectedValueFromDialog", (label, position = 1) => {
    cy.get(dialog.cdkOverlayContainerSelector).then(() => {
        cy.get(`${dialog.dialogSectionSelector}:visible`).then(() => {
            cy.getSelectedValue(label, position);
        });
    });
});

Cypress.Commands.add("getInputtedTextEditor", (label) => {
    cy.getBoTextEditor(label).then((editor) => {
        let textValue = editor.find("div").text();
        return textValue
    }).then(txt => cy.wrap(txt));
});
/**
 * @description Verify the inputted value in Read-only or Edit mode
 * @param {string} label
 * @param {string} value
 */
Cypress.Commands.add("verifyInputtedValue", (label, text) => {
    cy.getInputElement(label).then((input) => {
        let textValue = input.val();
        expect(textValue).to.be.equal(text);
    });
});

Cypress.Commands.add("verifyInputtedTextEditor", (label, text) => {
    cy.getBoTextEditor(label).then((editor) => {
        let textValue = editor.find("div").text();
        expect(textValue).to.be.contains(text);
    });
});

Cypress.Commands.add("verifySelectedValue", (label, searchText, position = 1) => {
    let inputElement;
    let elementIndex = position - 1;
    cy.get(`[placeholder$='${label}']`).then((ele) => {
        inputElement = ele.get(elementIndex).tagName;
        return ele.get(elementIndex);
    }).then((id) => {
        if (inputElement === "INPUT") {
            cy.get(id).parent("div").find(`${commonElements.nvDropdownPanel_options_label}:visible`)
                .invoke("text").then(selectedValue => expect(selectedValue.toUpperCase()).to.contain(searchText.toUpperCase()));
        } else if (inputElement === "DATE-PICKER") {
            cy.get(id).find("input[type='text']").eq(0).invoke("attr", "value").should("equal", searchText);
        } else if (inputElement === "SELECT"){
            cy.get(id).next().find("nv-drop-down-selected-option span").invoke("text")
                .then(selectedValue => expect(selectedValue.toUpperCase()).to.contain(searchText.toUpperCase()));
        }
        else {
            cy.get(id).find("div[class='item'] span").invoke("text")
                .then(selectedValue => expect(selectedValue.toUpperCase()).to.contain(searchText.toUpperCase()));
        }
    });
    cy.wait(500);
});

Cypress.Commands.add("getSelectedValue", (label, position = 1) => {
    let inputElement;
    let elementIndex = position - 1;
    cy.get(`[placeholder$='${label}']`).then((ele) => {
        inputElement = ele.get(elementIndex).tagName;
        return ele.get(elementIndex);
    }).then((id) => {
        if (inputElement === "INPUT") {
            cy.get(id).parent("div").find(`${commonElements.nvDropdownPanel_options_label}:visible`)
                .invoke("text").then((selectedValue) => {
                    // return selectedValue; 
                    return cy.wrap(selectedValue.trim());
                });
/*
    Still working on the following conditions
*/


        } else if (inputElement === "DATE-PICKER") {
            cy.get(id).find("input[type='text']").eq(0).invoke("attr", "value").should("equal", searchText);
        }
        else {
            cy.get(id).find("div[class='item'] span").invoke("text")
                .then(selectedValue => expect(selectedValue.toUpperCase()).to.contain(searchText.toUpperCase()));
        }
    });
    // Usage: cy.getSelectedValue("Vessel Type").then((type) => ...);
});

Cypress.Commands.add("verifyInputtedTextArea", (label, verified_text) => {
    cy.get('textarea:visible').then(($textareas) => {
        if ($textareas.length > 1) {
            // Iterate through each textarea and find the one with the matching placeholder
            cy.wrap($textareas).each(($textarea) => {
                cy.wrap($textarea).invoke('attr', 'placeholder').then((placeholder) => {
                    if (placeholder.includes(label)) {
                        // Found the matching textarea, verify its content
                        cy.wrap($textarea).invoke('val').then((content) => {
                            expect(content).to.equal(verified_text);
                        });
                    }
                });
            });
        } else {
            // Only one textarea, directly verify its content
            cy.get('textarea:visible').invoke('val').then((content) => {
                expect(content).to.equal(verified_text);
            });
        }
    });
});

Cypress.Commands.add("verifyRequiredFieldError", () => {
    cy.get(`${commonElements.tooltipValidationField}`).then(() => {
        cy.get(commonElements.nvTooltipWrapper).then((wrapper) => {
            let counter = wrapper.find(commonElements.exclamationIcon).length
            expect(counter, "The required field has an error!").to.be.greaterThan(0);
        });
    });
});

Cypress.Commands.add("inputValueByPlaceHolder", (placeholderText, text) => {
    cy.get(commonElements.viewPortSectionSelector).first().within(() => {
        cy.get(`${commonElements.inputTextSelector}[placeholder$='${placeholderText}']:visible`).clear()
            .type(text);
    });
    cy.wait(1000);
});

/*********************** CHECK FUNCTION  *****************************/
Cypress.Commands.add("checkCheckbox", (label) => {
    cy.contains("label", label).then(($lbl) => {
        const inputElement = $lbl.parent().find("input");
        if (!inputElement.is(":checked")) {
            cy.log("Check the Checkox!");
            cy.wrap(inputElement)
                .click({ force: true }).wait(500)
                .should('be.checked');
        }
    });
    cy.waitForPageLoaded();
});


Cypress.Commands.add("unCheckCheckbox", (label) => {
    cy.contains("label", label).then(($lbl) => {
        const inputElement = $lbl.parent().find("input");
        if (inputElement.is(":checked")) {
            cy.log("uncheck the Checkox!");
            cy.wrap(inputElement)
                .click({ force: true }).wait(500)
                .should('not.be.checked');
        }
    });
    cy.waitForPageLoaded();
});


/**************
 * @description Using the jQuery to check the checkbox. Find the INPUT element by PLACEHOLDER text 
 * @param {string} label
 */
Cypress.Commands.add("checkCheckbox__", (label) => {
    cy.get(`${commonElements.viewPortSectionSelector}:visible`).then(($viewPort) => {
        const checkboxes = $viewPort.find(commonElements.checkboxSelector).length;
        for (let index = 0; index < checkboxes; index++) {
            let placeholderValue = $viewPort.find(commonElements.checkboxSelector).get(index).getAttribute("placeholder");
            if (placeholderValue.includes(label)) {
                if (!$viewPort.find(commonElements.checkboxSelector).get(index).checked) {
                    $viewPort.find(commonElements.checkboxSelector).get(index).click();
                    return false;
                }
            }
        }
    });
    cy.wait(500);
});

/**************
 * @description Using the jQuery to uncheck the checkbox. Find the INPUT element by PLACEHOLDER text 
 * @param {string} label
 */
Cypress.Commands.add("unCheckCheckbox__", (label) => {
    cy.get(`${commonElements.viewPortSectionSelector}:visible`).then(($viewPort) => {
        const checkboxes = $viewPort.find(commonElements.checkboxSelector).length;
        for (let index = 0; index < checkboxes; index++) {
            let placeholderValue = $viewPort.find(commonElements.checkboxSelector).get(index).getAttribute("placeholder");
            if (placeholderValue.includes(label)) {
                if ($viewPort.find(commonElements.checkboxSelector).get(index).checked) {
                    $viewPort.find(commonElements.checkboxSelector).get(index).click();
                    break;
                }
            }
        }
    });
    cy.wait(500);
});

/**************
 * @description Using the jQuery to verify the Checkbox checked
 * @param {string} label
 */
Cypress.Commands.add("verifyCheckboxIsChecked", (label) => {
    cy.get(`${commonElements.viewPortSectionSelector}:visible`).then(($viewPort) => {
        const checkboxes = $viewPort.find(commonElements.checkboxSelector).length;
        for (let index = 0; index < checkboxes; index++) {
            let placeholderValue = $viewPort.find(commonElements.checkboxSelector).get(index).getAttribute("placeholder");
            if (placeholderValue.includes(label)) {
                const value = $viewPort.find(commonElements.checkboxSelector).get(index).checked;
                expect(value).to.be.true;
                break;
            }
        }
    });
    cy.wait(500);
});

/**************
 * @description Using the jQuery to verify the Checkbox unchecked
 * @param {string} label
 */
Cypress.Commands.add("verifyCheckboxIsUnChecked", (label) => {
    cy.get(`${commonElements.viewPortSectionSelector}:visible`).then(($viewPort) => {
        const checkboxes = $viewPort.find(commonElements.checkboxSelector).length;
        for (let index = 0; index < checkboxes; index++) {
            let placeholderValue = $viewPort
                .find(commonElements.checkboxSelector).get(index).getAttribute("placeholder");
            if (placeholderValue.includes(label)) {
                const value = $viewPort.find(commonElements.checkboxSelector).get(index).checked;
                expect(value).to.be.false;
                break;
            }
        }
    });
    cy.wait(500);
});

Cypress.Commands.add("checkRadioButton", (label, value) => {    
    cy.get(`${commonElements.radioBoxSelector}[placeholder*='${label}']`).each((item, index, list) => {
        if (item.parent("div").find("label").text() === value) {
            cy.wrap(item).click({ force: true });
            return false;
        }
    });
});

/*************************** CLICK FUNCTION *******************************/
Cypress.Commands.add("clickLink", (label) => {
    cy.waitForPopUpDisappeared();
    cy.get(`${commonElements.mainContainer}:visible`).should("be.visible").first()
        .within(() => {
            cy.get("a").then((items) => {
                const noOfA = items.length;
                for (let index = 0; index < noOfA; index++) {
                    if (items.get(index).hasAttribute("title")) {
                        const title = items.get(index).getAttribute("title").trim();
                        if (title === label) {
                            // || title.endsWith(label)) {
                            return items.get(index);
                        }
                    } else {
                        if (items.get(index).text.match(label)) {
                            return items.get(index);
                        }
                    }
                }
            }).then((sle) => {
                cy.get(sle).contains(label).click();
            });
        });
    cy.wait(1000);
    cy.waitForPageLoaded();
});

Cypress.Commands.add("clickLink__", (label) => {
    cy.get(`${commonElements.mainContainer}:visible`).should("be.visible").first()
        .within(() => {
            cy.get("a").contains((new RegExp("^" + label + "$", "g"))).click().wait(1000);
        });
});

Cypress.Commands.add("clickButton", (label) => {
    let trigger = {
        bln: false,
        element: ""
    }
    // cy.get(`${commonElements.viewPortSectionSelector}`).should("be.visible").first()
        // .within(() => {
            cy.get(`${commonElements.buttonSelector}:visible`)
                .then(($buttons) => {
                    const noOfButtons = $buttons.length;
                    for (let index = 0; index < noOfButtons; index++) {
                        let text = $buttons.get(index).innerText.toLowerCase().trim();
                        let attr = $buttons.get(index).getAttribute("title");
                        if (attr === label || text === label.trim().toLowerCase()) {
                            trigger["bln"] = true;
                            trigger["element"] = $buttons.get(index);
                        }
                    } // end FOR
                    return trigger;
                }).then((trigger) => {
                    if (trigger['bln'] == true) {
                        cy.log(`Click on ${label} button`);
                        cy.get(trigger['element']).click().wait(1000);
                    } else {
                        throw new Error(`There is no ${label} button!`);
                    }
                });
        // });
    cy.waitForPageLoaded();
});

Cypress.Commands.add("verifyButtonIsDisabled", (label) => {
    cy.get(`${commonElements.buttonSelector}:visible`).contains(label)
        .then(($btn) => {
            expect($btn.parent("button").attr("disabled"), `The ${label} button is disabled!`).to.be.equal("disabled");
        });
});

Cypress.Commands.add("verifyButtonIsEnabled", (label) => {
    cy.get(`${commonElements.buttonSelector}:visible`).contains(label)
        .then(($btn) => {
            expect($btn.parent("button").attr("disabled"), `The ${label} button is enabled!`).is.undefined;
        });
});

Cypress.Commands.add("clickAndWait", (label, trigger = true, counter = 0) => {
    if (trigger === true) {
        cy.get("button").contains(label).click().then(($element) => {
            cy.wait(1000);
            cy.wrap($element).parent("button").find("i[class]")
                .then((iElement) => {
                    if (iElement.attr("class").includes("fa-spinner")) {
                        cy.log("waiting for 1/2 seconds");
                        cy.wait(500);
                        cy.clickAndWait(label, false, 1);
                    }
                });
        });
    } else {
        cy.wait(500);
        cy.log("waiting for 1/2 seconds");
        counter = counter + 1;
        if (counter !== 3) {
            cy.log("Counter: ", counter);
            cy.clickAndWait(label, false, counter);
        }
    }
});

Cypress.Commands.add("clickTab", (label) => {
    cy.get(`${commonElements.nvTabs}:visible`)
        .should("be.visible").first().within((tabs) => {
            let tab = tabs.find(`li ${commonElements.nvTabItem}:contains('${label}')`);
            tab.click();
        });
    cy.wait(500);
    cy.waitForPageLoaded();
    cy.waitForPopUpDisappeared();
});

Cypress.Commands.add("clickSubTab", (label) => {
    cy.get(`${commonElements.nvTabs}:visible`)
        .should("be.visible").last().within((tabs) => {
            let tab = tabs.find(`li ${commonElements.nvTabItem}:contains('${label}')`);
            tab.click();
        });
    cy.wait(500);
    cy.waitForPageLoaded();
    cy.waitForPopUpDisappeared();
});
/*************************** SELECT FUNCTION *******************************/
/**
 * @description clearAndSelectValue  Just test with d-select drop-down list
 * @param {String} label - label of element to select from
 * @param {String} searchText - input searchText and select from dropdown list
 */
// There are 2 cases to test with new Name: selectValue
// 1. cy.selectValue
// 2. dialog.selectValue => update the selectValue in DialogElement page
// 3. test again with cy.selectValue
Cypress.Commands.add("selectValue__toBeDeleted", (label = "string", searchText, position = 1) => {
    let dropdownSelector;
    let tagName;
    let elementIndex = position - 1;
    if(label.includes("[") || label.includes("=")) {
        dropdownSelector = label;
    } else {
        dropdownSelector = `[placeholder$='${label}']`;
    }
    cy.get(dropdownSelector).then((ele) => {
        tagName = ele.get(elementIndex).tagName;
        console.log(ele.get(0).tagName);
        console.log(ele.get(0));
        return ele.get(elementIndex);
    }).then((id) => {
        if (tagName === "INPUT") {
            console.log(`${label} is Input element!`);
            cy.get(id).siblings().find("input:visible").scrollIntoView().clear().type(searchText);
            cy.wait(2200).then(() => {
                const bodyElement = Cypress.$("body"); // get Body tag
                cy.wrap(bodyElement).find(`${commonElements.nvDropdownPanel_options}:visible`)
                    .contains(searchText, { matchCase: false }).first().click();
            });
        } else {
            console.log(`${label} is other than INPUT!`);
            // Click x to remove selected option
            cy.get(id).find("div").then(($div) => {
                for (let index = 0; index < $div.length; index++) {
                    if ($div.get(index).className === "item") {
                        $div.get(index).querySelector("a").click();
                        return false;
                    }
                }
            });
            cy.get(id).find("input:visible").scrollIntoView().click().clear().type(searchText);
            cy.wait(1500).then(() => {
                const bodyElement = Cypress.$("body");
                cy.wrap(bodyElement).find(`${commonElements.optionValues}:visible`)
                    .contains(searchText, { matchCase: false }).first().click();
            });
        }
    });
    cy.wait(500);
});

Cypress.Commands.add("selectValue", (label, value) => {
    cy.get("label > span").contains(new RegExp("^" + label + "$", "g"))
        .then(($span) => {
            const bodyElement = Cypress.$("body");
            let childrenElements = $span.parent("label").parent("div").find(":not(div):not(label):not(span)");
            const element = childrenElements.get(0);
            if (element.tagName === "D-SELECT"){
                console.log("Tagname: d-select");
                let inputElement = element.querySelector("input");
                inputElement.setAttribute("id", `${label}input_FromDSelect`);
                let parentOfInput = inputElement.parentElement;
                let removeIconSelector = "div[class='item'] > a[title]";
                if (parentOfInput.querySelectorAll(removeIconSelector).length){
                    let removeIcon = parentOfInput.querySelector(removeIconSelector);
                    cy.wrap(removeIcon).click().wait(200);
                }
                cy.get(`input[id='${label}input_FromDSelect']`).clear().type(value).wait(2000).then(() => {
                    let searchedValue = "div[class='selectize-dropdown-content'] div[class*='option']:visible";
                    cy.wrap(bodyElement).find(searchedValue).first().click();
                });
            }  
            else if (element.tagName === "SELECT" || element.tagName === "INPUT"){
                // There 2 options: multiple and single 
                const nvDropDownElement = element.nextElementSibling.firstElementChild;
                let optionElement = "div[class='nv-dropdown-control']";
                let selectedOptionValue = "nv-drop-down-selected-option";

                if(nvDropDownElement.querySelectorAll(selectedOptionValue).length) {
                    // console.log("There is a selected option!");
                    let clearBtnSelector = "button[title='Clear']";
                    let clearBtn = nvDropDownElement.querySelector(clearBtnSelector);
                    cy.wrap(clearBtn).click().wait(200);
                } else {
                    // console.log("There is no selected option!");
                    let openBtnSelector = "button[title='Open']";
                    let openBtn = nvDropDownElement.querySelector(openBtnSelector);
                    cy.wrap(openBtn).click().wait(200);
                }

                // Input value
                if (nvDropDownElement.getAttribute("class").includes("multiple")) {
                    let inputElementSelector = "nv-dropdown-panel input[role='combobox']";
                    cy.wrap(bodyElement).find(inputElementSelector).clear().type(value).wait(500).then(() => {
                        let searchedValue = "nv-dropdown-panel div[class*='nv-dropdown-panel-items']";
                        cy.wrap(bodyElement).find(searchedValue).first().click().realPress("Tab");
                    });
                } else {
                    let inputElementSelector = "input[role='combobox']"; 
                    let inputElement = nvDropDownElement.querySelector(inputElementSelector);
                    let inputId = inputElement.getAttribute("id");
                    cy.get(`input[id='${inputId}']`).clear().type(value).wait(1000).then(() => {
                        let searchedValue = "nv-dropdown-panel div[class*='nv-dropdown-panel-items']";
                        cy.wrap(bodyElement).find(searchedValue).first().click().realPress("Tab");
                    });
                }
            }
        });
});

Cypress.Commands.add("clearSelectedValue", (label) => {
    let inputElement;
    cy.get(`[placeholder$='${label}']`).then((ele) => {
        inputElement = ele.get(0).tagName;
        return ele.get(0);
    }).then((id) => {
        cy.get(id).find("a[title='Remove']").click().realPress("Tab");
    });
    cy.wait(500);
});

// 18/04/2023 working onnnnnnnnnnnn
Cypress.Commands.add("selectValueRandomly", (label) => {
    let inputElement;
    cy.get(`[placeholder$='${label}']`).then((ele) => {
        inputElement = ele.get(0).tagName;
        return ele.get(0);
    }).then((id) => {
        if (inputElement === "INPUT") {
            cy.get(id).parent("div").find("input:visible").scrollIntoView().clear()//.type(searchText);
            cy.wait(1000).then(() => {
                const bodyElement = Cypress.$("body");
                cy.wrap(bodyElement).find(`${commonElements.nvDropdownPanel_options}:visible`).then(options => {
                    const opt = Math.floor(Math.random() * options.length);
                    options.get(opt).click();
                });
            });
        } else {
            cy.get(id).find("div").then(($div) => {
                for (let index = 0; index < $div.length; index++) {
                    console.log(`Index: ${index}`);
                    if ($div.get(index).className === "item") {
                        $div.get(index).querySelector("a").click();
                        return false;
                    }
                }
            });
            cy.get(id).find("input").scrollIntoView().click();
            cy.wait(1000).then(() => {
                const bodyElement = Cypress.$("body");
                cy.wrap(bodyElement).find(`${commonElements.optionValues}:visible`).then(options => {
                    const optValue = Math.floor(Math.random() * options.length);
                    options.get(optValue).click();
                });
            });
        }
    });
    cy.wait(1000);
});

Cypress.Commands.add("selectValueByPlaceHolder", (placeholderText, searchText) => {
    cy.get(`${commonElements.viewPortSectionSelector}:visible`).first().within(() => {
        cy.get(`${commonElements.selectSelector}[placeholder$='${placeholderText}']`).type(searchText);
    });
    cy.get(".selectize-dropdown-content:visible").then(() => {
        cy.contains(searchText).click();
    });
    cy.wait(500);
});

Cypress.Commands.add("selectValueFromDropDownListByPlaceHolder", (placeholderText, text) => {
    cy.get(commonElements.multiSelectSelector)
        .parents(`multi-select[data-placeholder='${placeholderText}']`).type(text)
        .then((element) => {
            cy.wrap(element).get("a[class='dropdown-item active'] span").contains(text)
                .click();
        });
    cy.wait(1000);
}
);


Cypress.Commands.add("selectMultipleValuesByIndex", (label, nth) => {
    cy.get(`${commonElements.multiSelectDropdownSelector}[id*='${label}']:visible`).click();
    cy.wait(200);
    cy.get(`${commonElements.multiSelectDropdownMenuSelector}:nth-child(${nth}) > a span[class='text']:visible`).click();
    // cy.realPress("Tab");
});

/************************************ SPECIFIC FUNCTION  ******************************************/
// Cypress.on('command:enqueued', (command) => {
//     if (command.type === "parent")
//         console.log('Command: %s with type %s args %o', command.name, command.type, command.args);
// });

Cypress.Commands.add("verifyClipboard", () => {
    cy.window().then((win) => {
        win.navigator.clipboard.readText().then((urlFromClipboard) => {
            cy.request(urlFromClipboard).then((response) =>
                expect(response.status).to.eq(200)
            );
        });
    });
});

Cypress.Commands.add("copyClaimID", () => {
    cy.get("bo-claim-id pre").realHover("mouse");
    cy.get("button[title='Copy Id']").click();
});

Cypress.Commands.add("copyClaimLink", () => {
    cy.get("bo-claim-id div[nvcopytextmenu] a pre").realHover("mouse");
    cy.get("button[title='Copy Link']").click();
});

Cypress.Commands.add("getClaimID", () => {
    cy.get("bo-claim-id pre", { timeout: 60000 }).should("be.visible")
        .invoke("text").then((text) => {
            return cy.wrap(text.toString().trim());
        }); // Usage: cy.getClaimID().then(() => { });
});

Cypress.Commands.add("getSubClaimID", () => {
    cy.get("bo-sub-claim-id nv-copy-text pre").first().invoke("text").then((text) => {
        return cy.wrap(text.toString().trim());
    });
});

Cypress.Commands.add("getLegalPersonId", () => {
    cy.get("header[class='customer-profile-summary'] h3").invoke("text").then((text) => {
        const result = text.split(" - ");
        return result;
    }).then((array) => {
        cy.wrap(array[0]);
    }); // Usage: cy.getLegalPersonId();
});

Cypress.Commands.add("getTotalLoggedHours", () => {
    cy.get("tfoot span[ng-bind-html*='env.getTotalLoggedHours']").invoke("text").then((text) => {
        let loggedHours = text.toString().trim().replace("Total: ", "");
        return cy.wrap(loggedHours);
    });  // Usage: cy.getTotalLoggedHours();
});

Cypress.Commands.add("getNumberFromRightPanel", () => {
    cy.get("dd[data-ng-bind=\"$ctrl.agreement.get('Number')\"]").invoke("text").then((text) => {
        return cy.wrap(text);
    });  // Usage: cy.getNumberFromRightPanel();
});

Cypress.Commands.add("getInformation", (header) => {
    /*
        Use THEN rather than WITHIN after the first GET command, because using WITHIN it will return the parent element instead of the child node element.
    */
    cy.get(commonElements.rightPanelSelector).then(() => {
        cy.get(commonElements.inforHeaderSelector).then((headerName) => {
            for (let index = 0; index < headerName.length; index++) {
                const headerText = headerName[index].innerText.trim();
                if (headerText === header) {
                    let node = headerName[index].nextSibling;
                    if (node !== "#comment") {
                        return node;
                    } else {
                        return node.nextSibling;
                    }
                }
            }
        }).then((element) => {
            // return cy.wrap(element).invoke("text"); or
            cy.wrap(element).invoke("text").then((value) => {
                return cy.wrap(value);
            });
        });
    });;  // Usage: cy.getInformation(header);
});

Cypress.Commands.add("getRowIndexBy", (columnHeader, targetRowValue) => {
    if (columnHeader === undefined && targetRowValue === undefined) {
        throw new Error("Missing columnHeader or targetRowValue value, please input the value!");
    }
    cy.get("thead:visible").contains("th:visible", columnHeader, { matchCase: false })
        .invoke("index").then((sourceColIndex) => {
            cy.get("tbody > tr:visible").then(($rowElement) => {
                const noOfRows = $rowElement.length;
                for (let index = 0; index < noOfRows; index++) {
                    const $span = $rowElement.get(index).getElementsByTagName("td")
                        .item(sourceColIndex).querySelector("span");
                    const text = $span.innerText;
                    if (text.toLowerCase().trim().endsWith(targetRowValue.toLowerCase())) {
                        $span.style.backgroundColor = "red";
                        return index;
                    }
                }
            }).then(index => {
                return cy.wrap(index);
            });
        }); // Usage: cy.getRowIndexBy().then(index => console.log(index));
});

Cypress.Commands.add("getDropdownValuesFrom", (label) => {
    let inputElement;
    let optionArray = [];
    cy.get(`[placeholder$='${label}']`).then((ele) => {
        inputElement = ele.get(0).tagName;
        return ele.get(0);
    }).then((id) => {
        if (inputElement === "INPUT") {
            cy.get(id).parent("div").find("input:visible").clear();
            cy.wait(1000).then(() => {
                const bodyElement = Cypress.$("body"); // get Body tag
                cy.wrap(bodyElement).find(`${commonElements.nvDropdownPanel_options}`).each(opt => {
                    optionArray.push(opt.text().trimEnd());
                });
            }).then(() => {
                return optionArray;
            });
        } else {
            cy.get(id).find("div").then(($div) => {
                for (let index = 0; index < $div.length; index++) {
                    if ($div.get(index).className === "item") {
                        $div.get(index).querySelector("a").click();
                        return;
                    }
                }
            });
            cy.get(id).find("input").click();
            cy.wait(1000).then(() => {
                const bodyElement = Cypress.$("body");
                cy.wrap(bodyElement).find(commonElements.optionValues).each(opt => {
                    optionArray.push(opt.text().trimEnd());
                });
            }).then(() => {
                return optionArray;
            });
        }
    }).then(array => {
        return cy.wrap(array);
    });
});

/**
     * @description	Getting the values from specified column and return an array
     * @param {String} columnHeader 
     * @returns {Array}
*/
Cypress.Commands.add("getValuesFromColumn", (columnHeader) => {
    let { tableSection } = resultTable.resultTableSection;
    const list = [];
    cy.get(`${tableSection.selector}:visible`).within(() => {
        cy.get("thead").contains("th", columnHeader, { matchCase: false }).invoke("index").then((index) => {
            cy.get("tbody > tr").each(($row) => {
                cy.wrap($row).find("td").eq(index).then(($cell) => {
                    cy.wrap($cell).find("span").invoke("text").then((text) => {
                        list.push(text.trim());
                    });
                });
            });
        });
    }).then(() => {
        return cy.wrap(list);
    });
});

Cypress.Commands.add("getSearchCriteriaValue", (label) => {
    cy.get(`${commonElements.searchFormSectionSelector}:visible`).then(() => {
        cy.get(`div[title='${label}'] > span`).then(($span) => {
            $span.css("color", "red");
            return cy.wrap($span.text().trim());
        });
    }); // Usage: cy.getSearchCriteriaValue("Vessel Type").then((type) => ...);
});

Cypress.Commands.add("getTaskCounterFromTab", () => {
    cy.get(`${commonElements.noteTaskCounterFromTab}`)
        .then((noteTask) => {
            let counter = noteTask.find("span").get(3).textContent;
            return cy.wrap(parseInt(counter.trim()));
    }); // Usage: cy.getTaskCounterFromTab();
});

Cypress.Commands.add("getNoteCounterFromTab", () => {
    cy.get(`${commonElements.noteTaskCounterFromTab}`)
        .then((noteTask) => {
            let counter = noteTask.find("span").get(1).textContent;
            return cy.wrap(parseInt(counter.trim()));
    }); // Usage: cy.getNoteCounterFromTab();
});

Cypress.Commands.add("getAttachmentCounterFromTab", () => {
    cy.get(`${commonElements.attachmentCounterFromTab}`)
        .then((noteTask) => {
            let counter = noteTask.find("span").get(1).textContent;
            return cy.wrap(parseInt(counter.trim()));
    }); // Usage: cy.getAttachmentCounterFromTab();
});

Cypress.Commands.add("getNotesListed", () => {
    cy.get(`${commonElements.parisNoteListSelector}:visible`).then((noteSection) => {
        if (noteSection.find(`${commonElements.emptyListSelector}:visible`).length === 1) {
            return cy.wrap(0);
        } else {
            cy.get(`${commonElements.parisNoteListSelector} ${commonElements.itemListSelector}:visible`)
                .then((noteCounter) => {
                return cy.wrap(noteCounter.length);
            }); // Usage: cy.getNotesListed();
        }
    });
});

Cypress.Commands.add("getTasksListed", () => {
    cy.get(`${commonElements.parisActivityListSelector}:visible`).then((taskSection) => {
        if (taskSection.find(`${commonElements.emptyListSelector}:visible`).length === 1) {
            return cy.wrap(0);
        } else {
            cy.get(`${commonElements.parisActivityListSelector} ${commonElements.itemListSelector}:visible`)
                .then((taskCounter) => {
                return cy.wrap(taskCounter.length);
            }); // Usage: cy.getNotesListed();
        }
    });
});

Cypress.Commands.add("saveAndVerifySuccessfulMessage", (message) => {
    message = message || "successful";
    cy.clickButton("Save");
    cy.waitForPageLoaded();
    cy.verifyPopUp(message);
});

Cypress.Commands.add("waitForSaveCompleted", (counter = 0) => {
    cy.get("button[title*='Sav']:visible").then(($save) => {
        if ($save.is(":disabled") && counter < 5) {
            counter = counter + 1;
            cy.log("Waiting for saving....");
            cy.wait(500);
            cy.waitForSaveCompleted(counter);
        }
    });
});

Cypress.Commands.add("waitForPopUpDisappeared", (counter = 0) => {
    cy.get(`${commonElements.toastContainerSelector}`).then(($popUpContainer) => {
        cy.wait(500);
        let $popUp = $popUpContainer.find(commonElements.popUpMessageSelector);
        if ($popUp.length > 0 && $popUp.is(":visible") && counter <= 5) {
            let headerPopUp = $popUp.find(commonElements.titleSelector).text();
            let messagePopUp = $popUp
                .find(commonElements.messageTextSelector).text().trim().toLowerCase();
            if (headerPopUp.includes("Wait") && counter <= 5) {
                counter = counter + 1;
                cy.log("Waiting for PopUp disappeared");
                cy.wait(1000);
                cy.waitForPopUpDisappeared(counter);
            }
            if (headerPopUp.includes("Error")) {
                assert.isFalse(true, messagePopUp);
            }
            if (headerPopUp.includes("Success") || headerPopUp.includes("Warning")) {
                $popUp.find(`${commonElements.closeButtonSelector}:visible`).click();
            }
        }
    });
});

Cypress.Commands.add("verifySuccessMessagePopUp", (textToValidate, counter = 0) => {
    // The counter variable is used to escape the infinite loop
    cy.get(`${commonElements.toastContainerSelector}`).then(($popUpContainer) => {
        cy.wait(500);
        let $popUp = $popUpContainer.find(commonElements.popUpMessageSelector);
        if ($popUp.is(":visible")) {
            let headerPopUp = $popUp
                .find(`${commonElements.successPopUpSelector}:visible`)
                .find(commonElements.titleSelector).text();
            let messagePopUp = $popUp
                .find(`${commonElements.successPopUpSelector}:visible`)
                .find(commonElements.messageTextSelector).text().trim();
            if (headerPopUp.includes("Success")) {
                $popUp.find(`${commonElements.successPopUpSelector}:visible`)
                    .find(`${commonElements.closeButtonSelector}:visible`).click();
                assert.isTrue(messagePopUp.toLowerCase().includes(textToValidate.toLowerCase()), messagePopUp);
            }
        }
    });
});

Cypress.Commands.add("verifyPopUp__bk", (textToValidate, counter = 0) => {
    cy.get(commonElements.popUpMessageSelector).wait(500).then(($popUpContainer) => {
        counter = counter + 1;
        let containerCounter = $popUpContainer.children().length;
        for (let index = 0; index < containerCounter; index++) {
            let attrPopUp = $popUpContainer.children().eq(index).attr("class");
            if (attrPopUp.includes('toast-error')) {
                let messageTxT = $popUpContainer.children().eq(index)
                    .find(commonElements.messageTextSelector).text().trim();
                cy.wait(200);
                cy.clickButton("Reset");
                cy.get("button[type='button']").contains("Back to").click();
            }
            if (attrPopUp.includes('toast-wait') && counter < 5) {
                cy.log('Waiting .....................');
                cy.wait(500);
                cy.verifyPopUp(textToValidate, counter);
            }
            if (attrPopUp.includes('toast-success')) {
                let messageTxT = $popUpContainer.children().eq(index)
                    .find(commonElements.messageTextSelector).text().trim();
                console.log(`MessageTXT: ${messageTxT}`);
                console.log(`textToValidate: ${textToValidate}`);
                assert.isTrue(messageTxT.toLowerCase().includes(textToValidate.toLowerCase()), messageTxT);
            }
        }
    });
    cy.waitForPageLoaded();
});

Cypress.Commands.add("verifyPopUp", (textToValidate, counter = 0) => {
    cy.get(commonElements.popUpMessageSelector).wait(500).then(($popUpContainer) => {
        counter = counter + 1;
        console.log("VerifyPopUp");
        if ($popUpContainer.children().length) {
            let attrPopUp = $popUpContainer.children("div").attr("class");
            console.log(`Attribute Class: ${attrPopUp}`);
            if (attrPopUp.includes('toast-error')) {
                let messageTxT = $popUpContainer
                    .find(commonElements.messageTextSelector).text().trim();
                cy.wait(200);
                cy.clickButton("Reset");
                cy.get("button[type='button']").contains("Back to").click();
                // assert.isTrue(messageTxT.includes(textToValidate.toLowerCase()), messageTxT);
                expect(messageTxT.toUpperCase(), messageTxT)
                    .to.contain(textToValidate.toUpperCase());
            }
            if (attrPopUp.includes('toast-wait') && counter < 5) {
                cy.log('Waiting .....................');
                cy.wait(500);
                cy.verifyPopUp(textToValidate, counter);
            }
            if (attrPopUp.includes('toast-success')) {
                let messageTxT = $popUpContainer
                    .find(commonElements.messageTextSelector).text().trim();
                // assert.isTrue(messageTxT.toLowerCase().includes(textToValidate.toLowerCase()), messageTxT);
                expect(messageTxT.toUpperCase(), messageTxT)
                    .to.contain(textToValidate.toUpperCase());
                if ($popUpContainer.find(commonElements.closeButtonSelector).length) {
                    $popUpContainer.find(commonElements.closeButtonSelector).trigger('click');
                }
            }
        }
    });
    cy.waitForPageLoaded();
});

Cypress.Commands.add("verifyWarningMessagePopUp", (textToValidate) => {
    cy.get(`${commonElements.toastContainerSelector}`).then(($popUpContainer) => {
        cy.wait(500);
        let $popUp = $popUpContainer.find(commonElements.popUpMessageSelector);
        if ($popUp.is(":visible")) {
            let headerPopUp = $popUp
                .find(`${commonElements.warningPopUpSelector}:visible`)
                .find(commonElements.titleSelector).text();
            let messagePopUp = $popUp
                .find(`${commonElements.warningPopUpSelector}:visible`)
                .find(commonElements.messageTextSelector).text().trim().toLowerCase();
            if (headerPopUp.includes("Wait")) {
                cy.wait(500);
                cy.verifyWarningMessagePopUp(textToValidate);
            }
            if (headerPopUp.includes("Warning")) {
                $popUp.find(`${commonElements.closeButtonSelector}:visible`).click();
                expect(messagePopUp).to.include(textToValidate.toLowerCase());
            }
        }
    });
});

Cypress.Commands.add("verifyErrorPopUp", (textToValidate) => {
    cy.get(commonElements.popUpMessageSelector).wait(1000).then(($popUpContainer) => {
        let attrPopUp = $popUpContainer.children().attr("class");
        let messageTxT = $popUpContainer.children()
            .find(commonElements.messageTextSelector).text().trim();
        assert.isTrue(attrPopUp.includes('toast-error'), "There is an error !!!!!");
        assert.isTrue(messageTxT.toLowerCase().includes(textToValidate.toLowerCase()), messageTxT);
        cy.get(`${commonElements.closeButtonSelector}`).click();
    });
});

Cypress.Commands.add("closeWarningMessagePopUp", () => {
    cy.get(`${commonElements.toastContainerSelector}`).then(($popUpContainer) => {
        // It doesn't work if :visible is added, so removed it here
        cy.wait(500);
        let $popUp = $popUpContainer.find(commonElements.popUpMessageSelector);
        if ($popUp.is(":visible")) {
            // cy.find() doesn't work here, cy.get() does
            cy.get(`${commonElements.closeButtonSelector}`).click();
        } else {
            cy.closeWarningMessagePopUp();
        }
    });
});

Cypress.Commands.add("closeErrorPopUp", () => {
    cy.get(`${commonElements.toastContainerSelector}`).then(($popUpContainer) => {
        // It doesn't work if :visible is added, so removed it here
        cy.wait(500);
        let $popUp = $popUpContainer.find(commonElements.popUpMessageSelector);
        if ($popUp.is(":visible")) {
            cy.get(`${commonElements.closeButtonSelector}`).click();
        }
    });
});

Cypress.Commands.add("getTextNO", (selector, index = 0) => {
    cy.get(selector).eq(index).invoke("text").then((value) => {
        return cy.wrap(value);
    });
});

Cypress.Commands.add("getText", { prevSubject: "element" }, ($element) => {
    cy.wrap($element).scrollIntoView();
    return cy.wrap($element).invoke("text");
    // Usage: cy.get("#something").getText();
});

Cypress.Commands.add("getLink", { prevSubject: "optional" }, (subject) => {
    if (subject) {
        cy.get(subject).get("a").its("href");
    } else {
        cy.get("a").its("href");
    }
    // Usage: cy.get("#something").getLink();
    // or cy.getLink()
});

/*
    Used to perform specific action from Detail Information of item, i.e: Offer, Object, etc.
*/
Cypress.Commands.add("performAction", (text) => {
    cy.get(commonElements.contextMenu).click().wait(100);
    cy.get(commonElements.contextMenuOptions).contains(text).then(($btnElement) => {
        if (!$btnElement.is(":disabled")) {
            $btnElement.click();
        } else {
            assert.isFalse(true, `The action ${text} is not available!`);
        }
    });
    cy.wait(1000);
    cy.waitForPageLoaded();
});

Cypress.Commands.add("viewSpecificItem", (text = "") => {
    cy.get(`${commonElements.noteListViewSelector}:visible`).within((table) => {
        cy.get(`${commonElements.noteItemSelector}`).each((item, index, list) => {
            console.log("Index value: " + index);
            if (text === "") {
                //click View icon for the first item
                //console.log("ITEM: ", item.find(commonElements.viewButtonSelector));
                cy.wrap(item).find(commonElements.viewButtonSelector).click();
                return false;
            } else {
                cy.wrap(item).find("p").then(($ele) => {
                    if ($ele.text() === text) {
                        cy.wrap(item).find(commonElements.viewButtonSelector).click();
                        //cy.log("Reassign value for index")
                        return false;
                    }
                });
            }
        });
    });
    cy.waitForPageLoaded();
    cy.wait(2000);
});

Cypress.Commands.add("verifyNewlyCreatedNote", (type = "", title = "") => {
    cy.get(`${commonElements.noteListViewSelector}:visible`).within((table) => {
        // cy.wait(2000)
        cy.get(`${commonElements.noteItemSelector}`).first().within((item) => {
            let expectedType = noteDialog.returnType(type);
            // console.log("Expected Value", expectedType);
            cy.wrap(item).as("noteItem");
            if (type !== "") {
                cy.get("@noteItem").find(commonElements.iconSelector).invoke("attr", "class")
                    .then((actualValue) => {
                        // console.log("ActualValue", actualValue)
                        expect(actualValue).to.contains(expectedType);
                    });
            }
            if (title !== "") {
                //cy.log("Checking title")
                cy.get("@noteItem").find(commonElements.noteTitleSelector).contains(title);
            }
        });
    });
});

// NOT COMPLETED YET or NOT USED
Cypress.Commands.add("verifyCreatedNote", (type) => {
    cy.get(`${commonElements.noteListViewSelector}:visible`).within((table) => {
        cy.get(`${commonElements.noteItemSelector}`).each((item, index, list) => {
            // console.log("Index value: " + index);
            let expectedType = noteDialog.returnType(type);
            console.log("Value", expectedType);
            // if (text === "") {
            //click View icon for the first item
            //console.log("ITEM: ", item.find(commonElements.viewButtonSelector));
            //const actualValue = item.find(commonElements.iconSelector).attr("class")
            //console.log("actualValue", actualValue)
            cy.wrap(item).find(commonElements.iconSelector).invoke("attr", "class")
                .then((actualValue) => {
                    console.log("ActualValue", actualValue);
                    expect(actualValue).to.contains(expectedType);
                });
            //return false;
            //console.log("New Index value: " + index)
            // } else {
            // cy.wrap(item).find("p").then(($ele) => {
            //     if($ele.text() === text) {
            //         cy.wrap(item).find(commonElements.viewButtonSelector).click();
            //         //cy.log("Reassign value for index")
            //         return false;
            //     }
            // });
            // }
        });
    });
});

Cypress.Commands.add("verifyHeader", (header) => {
    cy.get(`${commonElements.headerSelector}:visible`).should("contain", header);
});

Cypress.Commands.add("verifyHeaderTab", (label) => {
    cy.get(`${commonElements.nvTabs}:visible`)
        .should("be.visible").and("contain", label);
});
/*
    Does not work since 4.9.2
*/
Cypress.Commands.add("enterTextForCKEditor", (text) => {
    cy.get(commonElements.ckEditorSelector).within((ckEditor) => {
        cy.get(commonElements.sourceLink).click();
        cy.get(commonElements.textField).type(text);
        cy.get(commonElements.sourceLink).click();
    });
});

Cypress.Commands.add("verifyInputtedTextForCKEditor", (value) => {
    cy.get(`${commonElements.ckEditorSelector}`).should("be.visible").within(() => {
        cy.get('iframe').then(($iframe) => {
            const $body = $iframe.contents().find('body');
            cy.wrap($body).should('be.visible').then((body) => {
                const actualText = body.text().trim();
                expect(actualText).to.contains(value);
            });
        });
    });
});

Cypress.Commands.add("uploadFile", (...fileName) => {
    cy.get("input[type='file']").attachFile(fileName);
    cy.waitForPageLoaded();
    cy.wait(1000);
});

/**
 * @description Check if Row's Value (Text) (at least 1 row) based on Colum Header in Table or not
 * @param {String} colHeader - Column Header
 * @param {String} sourceValue - Value of Row
 */
Cypress.Commands.add("checkRowValueIsAvailableBasedOnColumHeader", (columnHeader, searchText) => {
    let isFound = false;
    // console.log(`Initial isFound: ${isFound}`);
    let tableSection = "table[class^='table table-hover']";
    cy.get(`${tableSection}:visible`).then((table) => {
        if (table.length > 1) {
            return table.last();
        }
    }).within(() => {
        cy.get("thead").scrollIntoView().contains("th:visible", columnHeader, { matchCase: false }).invoke("index")
            .then((index) => {
                cy.get("tbody > tr:visible").then($rowElement => {
                    console.log(`Initial isFound: ${isFound}`);
                    const noOfRows = $rowElement.length;
                    if (noOfRows === 1 && $rowElement.get(0).textContent.startsWith("No data available in table")) {
                        return false;
                    }
                    for (let nthRow = 0; nthRow < noOfRows; nthRow++) {
                        const $tdEle = $rowElement.get(nthRow);
                        const $span = $tdEle.getElementsByTagName("td")
                            .item(index).querySelector("span");
                        const text = $span.innerText;
                        if (text.toLowerCase().endsWith(searchText.toLowerCase())) {
                            $span.style.backgroundColor = "red";
                            isFound = true;
                            return false;
                        }
                    }
                });
            });
    }).then(() => {
        return cy.wrap(isFound);
    });
});

Cypress.Commands.add("resultTableIsSortedBy", (columnName, type = "string") => {
    let { tableSection } = resultTable.resultTableSection;
    let originalList = [];
    cy.get(`${tableSection.selector}:visible`).within(() => {
        cy.get("th").contains(columnName, { matchCase: false }).click().wait(1000).then(($element) => {
            cy.wrap($element).invoke("index").then((index) => {
                cy.wrap($element).invoke("attr", "aria-sort").then((order) => {
                    cy.get("tbody").within(() => {
                        cy.get("tr").each(($row) => {
                            cy.wrap($row).within(() => {
                                cy.get("td").eq(index).invoke("text").then((text) => {
                                    originalList.push(text.trim());
                                });
                            });
                        });
                    });
                    cy.wrap(order).then(() => {
                        if (type === "string") {
                            let orderedList = originalList;
                            if (order === "ascending") {
                                orderedList.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
                                assert.isTrue(JSON.stringify(originalList) == JSON.stringify(orderedList),
                                    `Column ${columnName} is not sorted in ascending order.`);
                            } else {
                                orderedList.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
                                assert.isTrue(JSON.stringify(originalList) == JSON.stringify(orderedList),
                                    `Column ${columnName} is not sorted in descending order.`);
                            }
                        } else {
                            if (order === "ascending") {
                                assert.isTrue(isArraySortedAscending(originalList),
                                    `Column ${columnName} is not sorted in ascending order.`);
                            } else {
                                assert.isTrue(isArraySortedDescending(originalList),
                                    `Column ${columnName} is not sorted in descending order.`);
                            }
                        }
                    });
                });
            });
        });
    });
});
// Do not work
Cypress.Commands.add("viewAttachedFileAndVerifyContent", (columnHeader, filename, contentFile) => {
    columnHeader = columnHeader || "File Name";
    cy.get("table[class^='table table-hover']:visible").within(() => {
        cy.get("thead").contains('th:visible', columnHeader, { matchCase: false }).invoke('index').then((index) => {
            cy.get("tbody > tr:visible").then(($rowElement) => {
                // var trigger = false; 
                const noOfRows = $rowElement.length;
                for (let nthRow = 0; nthRow < noOfRows; nthRow++) {
                    console.log(`Index: ${nthRow}`);
                    const $href = $rowElement.get(nthRow).getElementsByTagName("td")
                        .item(index).querySelector("a");
                    const text = $href.innerText;
                    console.log(`Text: ${text}`);
                    if (text.toLowerCase().endsWith(filename.toLowerCase())) {
                        // $href.style.backgroundColor = "red";
                        console.log("Found filename, then remove target attribute");
                        // $href.setAttribute("target", "_self");
                        // console.log($href.getAttribute("target"));
                        // $href.setAttribute("target", "_parent");
                        // console.log($href.getAttribute("target"));
                        // console.log("then click the href");
                        // $href.click();
                        // return false;
                        return $href
                    }
                }
            }).then(hrefElement => {
                // hrefElement.attr('target', '_self')
                // cy.log(hrefElement);
                // cy.window().document().then(function (doc) {
                //     doc.addEventListener('click', () => {
                //       // this adds a listener that reloads your page 
                //       // after 5 seconds from clicking the download button
                //       setTimeout(function() { 
                //         doc.location.reload()
                //         }, 1000)
                //     });
                //     cy.wrap(hrefElement).invoke('removeAttr','target').click();
                // });
                cy.wrap(hrefElement).invoke("attr", "href").then(link => {
                    cy.request(portal.url + link)
                        .its("status")
                        .should("eq", 200);
                });
            });
        });
    });
    cy.wait(2000);
    cy.get("body pre").contains(contentFile);
    cy.document().then((doc) => {
        // work with document element
        cy.log(doc);
    }); cy.go('back');
    cy.wait(2000);
});

Cypress.Commands.add("waitForRequest", (Alias, timeout = 10000) => {
    cy.wait(`@${Alias}`, { timeout: timeout }).its('response.statusCode').should('eq', 200);
    cy.wait(500);
});

Cypress.Commands.add("setRequest", (URL, method = 'GET') => {
    cy.intercept(method, `**${URL}*`).as(URL);
    cy.wait(500);
});

Cypress.Commands.add("verifyBottomLeftIsPresented", (counter = 0) => {
    cy.get(commonElements.toastContainerSelector).then($container => {
        let notification = $container.find(commonElements.shownNotificationBottomLeftToaster);
        if (notification.length == 0 && counter <= 5) {
            counter = counter + 1;
            cy.log("Waiting for Notification ...");
            cy.wait(1000);
            cy.verifyBottomLeftIsPresented(counter);
        } else if (notification.length == 1) {
            cy.log("Notification found");
            cy.get(commonElements.shownNotificationBottomLeftToaster).should("be.visible");
            return;
        } else {
            throw new Error("There are no notification pop up!");
        }
    });
});

//**************************************** The Existing Customized Commands *******************************/
Cypress.Commands.add("parisWebLoginWithCookies", (delay) => {
    cy.logIntoPortal(portal.username, portal.password);
    Cypress.Cookies.defaults({
        preserve: (cookie) => {
            return true;
        },
    });
});
Cypress.Commands.add("logoutClearCookies", (delay) => {
    Cypress.Cookies.defaults({
        preserve: [],
    });
    cy.clearCookies();
});
Cypress.Commands.add("get_new_dialog", () => {
    //cy.get('section.dialog:visible', { timeout: normalTimeout })
    cy.get(".ngdialog-content:visible", { timeout: normalTimeout });
    // .within(() => {
    //     resultTable.getResultTable()
    // })
}); //can be uesed on AVserach and Create, follow by within()

Cypress.Commands.add("close_new_dialog", () => {
    cy.get_new_dialog().within(() => {
        //cy.get('.pull-right > .btn').dblclick()
        cy.get('[aria-label="Dismiss"]', { timeout: normalTimeout }).dblclick(); //can be closed by manually click, but has to used double click on cypress?????
    });
});

Cypress.Commands.add("wait_until_green_progress_bar_appear", () => {
    cy.waitUntil(
        () =>
            cy.get(".filled-bar", { timeout: normalTimeout }).should("be.visible"),
        { timeout: normalTimeout }
    );
});

Cypress.Commands.add("wait_until_green_progress_bar_disappear", () => {
    cy.waitUntil(
        () =>
            cy
                .get(".filled-bar", { timeout: normalTimeout })
                .should("have.attr", "style", "width: 0px;"),
        { timeout: normalTimeout }
    );
});

Cypress.Commands.add("search_object_by_name", (objectName) => {
    cy.get('input[name^="$ctrl.advanceSearchForm."][name$="ame"]', {
        timeout: normalTimeout,
    }).type(objectName);
    cy.click_on_search_button();
    cy.wait_until_green_progress_bar_disappear();
});

Cypress.Commands.add("click_on_button_with_title", (title) => {
    cy.get("button")
        .contains(`${title}`, { matchCase: false })
        .should("be.visible")
        .click();
});

Cypress.Commands.add("click_on_link_with_title", (title) => {
    cy.get(`a[title="${title}"]`, { timeout: normalTimeout }).first().click();
});

Cypress.Commands.add("reset_and_wait", () => {
    cy.get('button[title="Reset"]', { timeout: normalTimeout })
        .should("be.visible")
        .click();
    cy.waitUntil(() =>
        cy
            .get("button[title='Search']", { timeout: normalTimeout })
            .should("not.be.disabled")
    );
    cy.wait_until_green_progress_bar_disappear();
    cy.wait_until_table_finish_loading();
});

Cypress.Commands.add("get_result_table", () => {
    cy.get("table.dataTable", { timeout: normalTimeout }).each(($element) => {
        cy.wrap($element).scrollIntoView();
    });
    cy.get("table.dataTable:visible", { timeout: normalTimeout });
}); //.table-hover.table-striped.table-condensed.dtr-inline

Cypress.Commands.add("get_field_with_label", (fieldLabel) => {
    cy.get('[fields="fields"]', { timeout: normalTimeout })
        .contains(fieldLabel, { timeout: normalTimeout, matchCase: false })
        .parent();
});


Cypress.Commands.add("createOfferByAPI", (authToken, type = "ENERGY_2") => {
    cy.request({
        url: api.baseEndpoint + "/offermarine/agreements/init",
        method: "POST",
        headers: {
            Authorization: authToken,
        },
        body: {
            type: type
        }
    }).then((response) => {
        let requestBody = response.body;
        requestBody.agreement.source = {
            "id": 100001,
            "name": "100001 ***",
            "shortName": "100001 ***",
            "type": "CUSTOMER_DIR_5",
            "status": "NORMAL_0",
            "stopUse": false,
            "canModify": true,
            "crmId": "3856",
            "externalId": "001D000000fxRzeIAE",
            "orgNo": "FI18462270",
            "ssn": "",
            "invisible": false,
            "sanction": {
                "blockPayment": false,
                "blockPaymentMessage": null,
                "stopTreatment": false,
                "stopTreatmentMessage": null,
                "warning": true,
                "warningMessage": "<br />100001 100001 *** 3856 <br><strong> Not KYC approved or KYC approval has expired. Check KYC-status. KYC assessment needs to be carried out prior to use.</strong> "
            }
        };
        requestBody.agreement.originalInsured = {
            "id": 100001,
            "name": "100001 ***",
            "shortName": "100001 ***",
            "type": "CUSTOMER_DIR_5",
            "status": "NORMAL_0",
            "stopUse": false,
            "canModify": true,
            "crmId": "3856",
            "externalId": "001D000000fxRzeIAE",
            "orgNo": "FI18462270",
            "ssn": "",
            "invisible": false,
            "sanction": {
                "blockPayment": false,
                "blockPaymentMessage": null,
                "stopTreatment": false,
                "stopTreatmentMessage": null,
                "warning": true,
                "warningMessage": "<br />100001 100001 *** 3856 <br><strong> Not KYC approved or KYC approval has expired. Check KYC-status. KYC assessment needs to be carried out prior to use.</strong> "
            }
        };
        requestBody.agreement.busnClass = 10;
        requestBody.agreement.busnRegion = 10;
        requestBody.agreement.busnSection = 23;
        requestBody.agreement.busnBranch = 23;
        requestBody.agreement.team = 0;
        requestBody.agreement.customerTransactionTeam = "OFFS";
        requestBody.agreement.startDate = "2024-01-01";
        requestBody.agreement.endDate = "2024-12-31";
        cy.request({
            url: api.baseEndpoint + "/offermarine/agreements/",
            method: "POST",
            headers: {
                Authorization: authToken,
            },
            body: requestBody,
        }).then((offerDetails) => {
            return offerDetails.body;
        });
    });
});

Cypress.Commands.add("connectObjectToOfferByAPI", (authToken, agreementID, offerID, objects = []) => {
    cy.request({
        url: api.baseEndpoint + "/offermarine/objects/connectobjects",
        method: "POST",
        headers: {
            Authorization: authToken,
        },
        body: {
            agreementId: agreementID,
            offerMarineAgreementId: offerID,
            objectNumbers: objects
        }
    }).then((response) => {
        expect(response.status).to.equal(204);
    });
});

Cypress.Commands.add("deleteOfferByAPI", (authToken, offerID) => {
    cy.request({
        url: api.baseEndpoint + `/offermarine/agreements/${offerID}`,
        method: "DELETE",
        headers: {
            Authorization: authToken,
        },
    }).then((response) => {
        expect(response.status).to.equal(204);
    });
});

// Run forever even using cy.wait(@)
Cypress.Commands.add("delayRequest", (api, milliseconds) => {
    cy.intercept({
        url: `*/api/paris/plugin?plugin=${api}*`,
        times: 1
    }, (req) => {
        req.reply({
            //Minimum network latency or delay to add to the response time (milliseconds)
            // delay: milliseconds, 
            //Maximum data transfer rate of the response (kilobits/second)
            throttleKbps: 5000,
        });
    }).as(api);
});

