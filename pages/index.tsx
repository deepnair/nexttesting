import type { NextPage } from 'next'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import validator from 'validator'

const Home: NextPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [warning, setWarning] = useState('')

  const setWarningFunction = () => {
    
    if(!validator.isEmail(email)){
      setWarning('E-mail is not valid')
    }else if(!validator.isLength(password, {min: 5})){
      setWarning('Password is less than 5 characters')
    }else if(!validator.equals(password, confirmPassword)){
      setWarning('The confirmation password does not match the password')
    }
  }

  return (
    <div className={styles.container}>
      <p>hello world</p>
      <label htmlFor='email'>E-mail</label>
      <input type='text' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
      <label htmlFor='password'>password</label>
      <input type='password' name='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
      <label htmlFor='confirmPassword'>Password Confirmation</label>
      <input type='password' name='confirmPassword' id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>
      {warning && <p className={styles.red}>{warning}</p>}
      <button onClick={setWarningFunction}>Submit</button>
    </div>
  )
}

export default Home
