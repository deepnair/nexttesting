# Nextjs Testing Refresher

Objective: Create a simple form with e-mail, password, and confirm password fields. Do the following tests:

1. A basic hello world test.
1. The form has an email, password and confirm Password field.
1. Initially the value of each of the fields is empty. 
1. When you type something into each of the fields, the same thing must be in the value of the field.
1. If the email in the email field is not valid, "email is not valid" should be displayed on the screen on pressing the submit button.
1. If the password field has less than 5 characters, you must see "password should be more than 4 characters" on the screen on pressing the submit button.
1. If the confirmPassword field is not the same as the password field you must see "Confirm password should be the same as password" on the screen on pressing the submit button.

This will follow a TDD (Test Driven Development) approach where the tests are written first, following which the code is written.

## Steps

### Setup

1. Create the app by running
    ```
    yarn create next-app nexttesting --ts
    ```
1. Install the dependencies which are needed for testing a Next.js app
    ```
    yarn add @testing-library/react @testing-library/user-event @testing-library/jest-dom jest jest-environment-jsdom -D
    ```
1. Later validator would be required for basic validation of the form fields. This could be added now itself
    ```
    yarn add validator && yarn add @types/validator -D
    ```
1. After doing this, the boilerplate must be added in a next.config.js at the root of the project. 
1. Create a \_\_tests__ folder at the root of the application. Within it create a index.spec.js. Now the application is setup for testing

### Basic test setup 

1. Before each of the tests we know that the Home component from the index.tsx needs to be rendered. So we import render, and screen (which will be needed later) from @testing-library/react.
1. We can create a beforeEach function which in turn takes an arrow callback function that will run before every single test.
    ```js
    beforeEach(() => {
        render(<Home/>)
    })
    ```
    Where the Home is imported from '../pages'

### (Testing) 1. Hello World test
First write a describe section, then within a callback function write a test that describes the test. Within a callback function within the test, first get an element that has the text 'hello world' in it. Then expect that to be in the document. Finally test that the textContent of the element is 'hello world' (This step is a bit redundant but included in this as a reference)

```js
describe('Basic hello world test', () => {
    test("Is hello world there?", () => {
        const helloworld = screen.getByText('hello world')
        expect(helloworld).toBeInTheDocument;
        expect(helloworld.textContent).toBe('hello world')
    })
})
```
### (Coding) 1. Hello World test

1. Create a container class in the Home.module.css that does margin auto and width 80%.
1. In the globals.css make the margin, padding 0 and make the box-sizing border box.
1. Delete everything in the return of the index.tsx.
1. In the return of the index.tsx, create a p tag and write 'hello world' in it. 

### (Testing) 2. The form has an email, password, and confirm password fields
1. A new describe is created that will contain all the form tests.
1. Within this describe as well create a beforeEach that will render the Home component before each test in this describe.
    ```js
    describe('Form tests', () =>  {

        beforeEach(() => {
            render(<Home/>)
        })
    }
    ```
1. We get the email field by role 'textbox' with the name of the field as a further option to identify it.
    ```js
    test('The form has an email, password and confirm Password field', () => {
        const emailField = screen.getByRole('textbox', {
            name: 'E-mail E-mail'
        })
    })
    ```
1. Note the order in which we should use getBys is as follows as we want to test things the way a user would use it. So we start from the ones that everyone would use and as a last resort use a test-id that the user does not even see:
    1. getByRole
    1. getByLabelText
    1. getByPlaceholderText
    1. getByText
    1. getByDisplayValue
    1. getByAltText
    1. getByTitle
    1. getByTestId

1. For the next two fields (password and confirm password), contrary to what you would think input elements with a type='password' are not recognized as having the role of a 'textbox', so you have to use the next priority down of getByLabelText to access them. 
    ```js
    const passwordField = screen.getByLabelText('password')
    const confirmPasswordField = screen.getByLabelText('Password Confirmation')
    ```
1. Finally you expect them to all be in the document.
    ```js
    expect(emailField).toBeInTheDocument
    expect(passwordField).toBeInTheDocument
    expect(confirmPasswordField).toBeInTheDocument
    ```
    All put together the test would look as follows:
    ```js
    test('The form has an email, password and confirm Password field', () => {
        const emailField = screen.getByRole('textbox', {
            name: 'E-mail E-mail'
        })
        const passwordField = screen.getByLabelText('password')
        const confirmPasswordField = screen.getByLabelText('Password Confirmation')

        expect(emailField).toBeInTheDocument
        expect(passwordField).toBeInTheDocument
        expect(confirmPasswordField).toBeInTheDocument
    })
    ```
### (Coding) 2. The form has an email, password, and confirm password fields

1. Create an input of type text, along with a label before it for the e-mail field.
1. Then make an input of type password, along with a label for both the password and the confirm password fields.
