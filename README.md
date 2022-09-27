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
First write a describe section, then within a callback function write a test function. The test function will take a string describing the test followed by a callback function. Within the callback function, first get an element that has the text 'hello world' in it. Then expect that to be in the document. Finally test that the textContent of the element is 'hello world' (This step is a bit redundant but included in this as a reference)

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

### (Testing) Initially the value of each of the fields is empty

1. In order to make the work simpler and avoid a lot of boilerplate code, we create a getField function that takes in a field variable. 
1. Within this function we create an object called value with string parameters which have a value corresponding to selecting a field. Then the function finally returns the value[field].
    ```js
    const getField = (field) => {
        const values = {
            'email': screen.getByRole('textbox', {
                name: 'E-mail E-mail'
            }),
            'password': screen.getByLabelText('password'),
            'confirmPassword': screen.getByLabelText('Password Confirmation'),
        }
        
        return values[field]
    }
    ```
1. Now we can quite simply write the test for each of the fields should be empty at the beginning as follows:
    ```js
    test('Initially the value of each of the fields is empty', () => {
        
        expect(getField('email').value).toBe('')
        expect(getField('password').value).toBe('')
        expect(getField('confirmPassword').value).toBe('')
    })
    ```
### (Testing) 4. When you type something into each of the fields, the same thing must be in the value of the field.

1. In order to test typing in something we need to import userEvent from @testing-library/user-event
1. The function is made async and you wait userEvent.type followed by the field and the string to be typed.
1. Then you expect the value of the field to be the string that you typed in the userEvent.
    ```js
    test('When you type something into each of the fields, the same thing must be in the value of the field', async () => {
        
        await userEvent.type(getField('email'), 'hello@email.com')
        await userEvent.type(getField('password'), 'password')
        await userEvent.type(getField('confirmPassword'), 'password')

        expect(getField('email').value).toBe('hello@email.com')
        expect(getField('password').value).toBe('password')
        expect(getField('confirmPassword').value).toBe('password')
    })
    ```
### (Testing) 5. If the email in the email field is not valid, "email is not valid" should be displayed on the screen on pressing the submit button.

1. Before doing this, we must specify the parameters for the submit button and the element where the warning message will appear in the getField function. For the submit function we will look for the first element that has the word 'Submit' in it (it can be different if there are other elements that contain 'Submit' in them)
    ```js
    const getField = (field) => {
        const values = {
            'email': screen.getByRole('textbox', {
                name: 'E-mail E-mail'
            }),
            'password': screen.getByLabelText('password'),
            'confirmPassword': screen.getByLabelText('Password Confirmation'),
            'submit': screen.getAllByText('Submit')[0]
        }
    
        return values[field]
    }
    ```
    Alternatively, we could have simply got By Role the first button along with other attributes if there's a need to be more specific.
1. For the warning element, we add a searchQuery parameter. This will be the text by which we search for the warning element.
    ```js
    const getField = (field, searchQuery = '') => {
        const values = {
            'email': screen.getByRole('textbox', {
                name: 'E-mail E-mail'
            }),
            'password': screen.getByLabelText('password'),
            'confirmPassword': screen.getByLabelText('Password Confirmation'),
            'submit': screen.getAllByText('Submit')[0],
            'warning': screen.queryAllByText(searchQuery)[0]
        }
        
        return values[field]
    }
    ```
    For this one, we will use query rather than get because frequently there will be no warning and we don't want the test to crash if there is nothing starting with the warning test. Query can give a null value, and the test doesn't give an error.
1. Once the getField is ready, we use userEvent to first type an invalid e-mail, followed by using userEvent to click the submit button and finally we expect the warning to appear.
    ```js
    test('If the email in the email field is not valid, "email is not valid" should be displayed on the screen on pressing the submit button', async() => {
        await userEvent.type(getField('email'), 'helloemail.com')
        await userEvent.click(getField('submit'))
        expect(getField('warning', 'E-mail is not valid').textContent).toBe('E-mail is not valid')

    })
    ```
### (Coding) 5. If the email in the email field is not valid, "email is not valid" should be displayed on the screen on pressing the submit button.
1. In order to test if the e-mail is valid we first create a state for the email that will hold the value typed into the e-mail input. And we create a warning state that will hold the warning message.
    ```ts
    const [email, setEmail] = useState('')
    const [warning, setWarning] = useState('')
    ```
1. Then within the return, we create a submit button, after which we double bind the state to the email input. 
    ```jsx
    <input type='text' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
    
    <button>Submit</button>
    ```
1. If the warning state is true, we add a paragraph that contains the warning message, and we add a style to it that makes the text color red.
    ```jsx
    <input type='text' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
    {warning && <p className={styles.red}>{warning}</p>}
    <button>Submit</button>  
    ```
1. Now we write a function that will set the warning state to the warning we want if the e-mail is not valid. For this we use the isEmail method of validator which we import from validator.
    ```ts
    const setWarningFunction = () => {
        if(!validator.isEmail(email)){
        setWarning('E-mail is not valid')
        }
    }
    ```
1. Finally, we set the submit button's onclick to this function.
    ```jsx
    <button onClick={setWarningFunction}>Submit</button>
    ```
### (Testing) 6. If the password field has less than 5 characters, you must see "password should be more than 4 characters" on the screen on pressing the submit button.
Using the userEvent type in a valid e-mail first (else it will give that error), then type in a password that has only 4 characters and using userEvent click the submit event. Expect the warning to have the text of the password error.
```js
test('If the password field has less than 5 characters, you must see "password should be more than 4 characters" on the screen on pressing the submit button', async () => {
    await userEvent.type(getField('email'), 'hello@email.com')
    await userEvent.type(getField('password'), '1234')
    await userEvent.click(getField('submit'))
    expect(getField('warning', 'Password is less than 5 characters').textContent).toBe('Password is less than 5 characters')
})
```
### (Coding) 6. If the password field has less than 5 characters, you must see "password should be more than 4 characters" on the screen on pressing the submit button.

1. Create a state for the password field and and the confirmPassword field. (we will need it in the next test).
    ```ts
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    ```
1. Double bind both the fields to their respective states.
    ```jsx
    <label htmlFor='password'>password</label>
    <input type='password' name='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
    <label htmlFor='confirmPassword'>Password Confirmation</label>
    <input type='password' name='confirmPassword' id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>
    ```
1. Use the isLength method of validator to mention the minimum number of characters in the setWarningFunction and set the warning state to the correct warning.
    ```ts
    const setWarningFunction = () => {
        (password, {min: 5}))
        if(!validator.isEmail(email)){
        setWarning('E-mail is not valid')
        }else if(!validator.isLength(password, {min: 5})){
        setWarning('Password is less than 5 characters')
        }
    }
    ```
### (Testing) 7. If the confirmPassword field is not the same as the password field you must see "Confirm password should be the same as password" on the screen on pressing the submit button.
Using userEvent type in a valid e-mail, password, and type in a confirmPassword that is not the same as password. Then using userEvent click the submit button and expect the warning of password and confirm password do not match.

```js
test('If the confirmPassword field is not the same as the password field you must see "Confirm password should be the same as password" on the screen on pressing the submit button', async () => {
    await userEvent.type(getField('email'), 'hello@email.com')
    await userEvent.type(getField('password'), '12345')
    await userEvent.type(getField('confirmPassword'), '1234')
    await userEvent.click(getField('submit'))
    expect(getField('warning', 'The confirmation password does not match the password').textContent).toBe('The confirmation password does not match the password')
})
```
### (Coding) 7. If the confirmPassword field is not the same as the password field you must see "Confirm password should be the same as password" on the screen on pressing the submit button.

Using the equals method of the validator, set the warning to the correct warning if the password and confirmPassword don't match.

```ts
const setWarningFunction = () => {
    
    if(!validator.isEmail(email)){
      setWarning('E-mail is not valid')
    }else if(!validator.isLength(password, {min: 5})){
      setWarning('Password is less than 5 characters')
    }else if(!validator.equals(password, confirmPassword)){
      setWarning('The confirmation password does not match the password')
    }
  }
  ```
  Note that else ifs are used so that warnings that happen in the earlier fields are displayed first, only after rectifying those will they show the errors of the lower fields.


