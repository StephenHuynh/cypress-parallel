## Cypress Configuration

# Env CLI
```shell
CYPRESS_BASE_URL=https://staging.app.com BASE_ENDPOINT=https://apidev.app.com 
npx cypress-cloud run --parallel --record --ci-build-id ${env.BUILD_ID}
```



```shell
cypress run --config '{"watchForFileChanges":false,"specPattern":["**/*.cy.js","**/*.cy.ts"]}'
```