import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Home from "../pages"

//A basic function to get any field to save typing more
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


//Render the Home component from the index.tsx before each test
beforeEach(() => {
    render(<Home/>)
})
//A basic hello world test 
describe('Basic hello world test', () => {
    test("Is hello world there?", () => {
        const helloworld = screen.getByText('hello world')
        expect(helloworld).toBeInTheDocument;
        expect(helloworld.textContent).toBe('hello world')
    })
})

describe('Form tests', () =>  {

    beforeEach(() => {
        render(<Home/>)
    })

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

    //Initially the value of each of the fields is empty
    test('Initially the value of each of the fields is empty', () => {
        //Normal way to do it
        // const emailField = screen.getByRole('textbox', {
        //     name: 'E-mail E-mail'
        // })
        // const passwordField = screen.getByLabelText('password')
        // const confirmPasswordField = screen.getByLabelText('Password Confirmation')
        
        // expect(emailField.value).toBe('')
        // expect(passwordField.value).toBe('')
        // expect(confirmPasswordField.value).toBe('')

        //Brief way to show it
        expect(getField('email').value).toBe('')
        expect(getField('password').value).toBe('')
        expect(getField('confirmPassword').value).toBe('')
    })
    //When you type something into each of the fields, the same thing must be in the value of the field
    test('When you type something into each of the fields, the same thing must be in the value of the field', async () => {
        
        await userEvent.type(getField('email'), 'hello@email.com')
        await userEvent.type(getField('password'), 'password')
        await userEvent.type(getField('confirmPassword'), 'password')

        expect(getField('email').value).toBe('hello@email.com')
        expect(getField('password').value).toBe('password')
        expect(getField('confirmPassword').value).toBe('password')
    })
    //If the email in the email field is not valid, "email is not valid" should be displayed on the screen on pressing the submit button
    test('If the email in the email field is not valid, "email is not valid" should be displayed on the screen on pressing the submit button', async() => {
        await userEvent.type(getField('email'), 'helloemail.com')
        await userEvent.click(getField('submit'))
        expect(getField('warning', 'E-mail is not valid').textContent).toBe('E-mail is not valid')

    })
    //If the password field has less than 5 characters, you must see "password should be more than 4 characters" on the screen on pressing the submit button 
    test('If the password field has less than 5 characters, you must see "password should be more than 4 characters" on the screen on pressing the submit button', async () => {
        await userEvent.type(getField('email'), 'hello@email.com')
        await userEvent.type(getField('password'), '1234')
        await userEvent.click(getField('submit'))
        expect(getField('warning', 'Password is less than 5 characters').textContent).toBe('Password is less than 5 characters')
    })
    //If the confirmPassword field is not the same as the password field you must see "Confirm password should be the same as password" on the screen on pressing the submit button
    test('If the confirmPassword field is not the same as the password field you must see "Confirm password should be the same as password" on the screen on pressing the submit button', async () => {
        await userEvent.type(getField('email'), 'hello@email.com')
        await userEvent.type(getField('password'), '12345')
        await userEvent.type(getField('confirmPassword'), '1234')
        await userEvent.click(getField('submit'))
        expect(getField('warning', 'The confirmation password does not match the password').textContent).toBe('The confirmation password does not match the password')
    })
})
