class LoginPage {

    getUsername() {
        return cy.get('input[name=username]');
    }
    getPassword(){
        return cy.get('input[name=password]');
    }
    getLoginButton() {
        return cy.get('#btn-login');
    }

    getErrorMessage() {
        return cy.get('#error-message');
    }

    getLoginTitle() {
        return cy.get("span[class*='form-title']");
    }
    
}

export default LoginPage
    