import {Given, Then, When} from "@cucumber/cucumber";
import {SignupPage} from "../../pages/signupPage";
import {Container, ContainerKeys} from "../../containers/container";

const {setDefaultTimeout} = require('@cucumber/cucumber');
setDefaultTimeout(setDefaultTimeout);

let signupPage: SignupPage

Given('User clicks on sign up button', async function () {
    signupPage = Container.resolve(ContainerKeys.signupPage);
    await signupPage.clickOnSignup()
    await signupPage.verifySignUpPageVisible()
});

When('User enter an email {string} and password {string}', async (email: string, password: string) => {
    await signupPage.setEmailAndPassword(email, password);
});

Then('the user is not Signup', async function () {
    await signupPage.verifySignUpPageVisible()
});


Then('Verify the email input is not valid', async function () {
    await signupPage.verifyEmailInputNotValid();
});

Then('Verify the password input is not valid', async function () {
    await signupPage.verifyPasswordInputNotValid();
});


