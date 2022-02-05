import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

test('login input init empty', () => {
    render(<Login />);
    const loginInput = screen.getByRole('textbox')
    expect(loginInput.value).toBe('')
})

test('enter text input', () => {
    render(<Login />)
    const loginInput = screen.getByRole('textbox')
    fireEvent.change(loginInput, {target: {value: '23'}})
    expect(loginInput.value).toBe('23')
})

test('check input username validation', async () => {
    render(<Login />)
    const loginInput = screen.getByRole('textbox')
    fireEvent.change(loginInput, {target: {value: '23'}})
    const loginBtn = screen.getByRole('button')
    fireEvent.click(loginBtn)
    const errMessage = await screen.findByText(/username or password is incorrect/i)
    expect(errMessage).toBeInTheDocument()
})

