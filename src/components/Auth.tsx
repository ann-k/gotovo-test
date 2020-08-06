import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import fb from './../firebaseConfig'

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
    recaptchaWidgetId?: any;
  }
}

interface CustomProps {
  updateUser: (e: any) => void;
  user: boolean;
}

const Auth: React.FC<CustomProps> = (props) => {
  let captchaRef = useRef<HTMLDivElement>(null)
  const phoneNumberRef = useRef<HTMLInputElement>(null)
  const [phoneNumberFormDisabled, disablePhoneNumberForm ] = useState<boolean>(false)
  const [codeFormDisabled, disableCodeForm ] = useState<boolean>(true)

  useEffect(() => {
    window.recaptchaVerifier = new fb.auth.RecaptchaVerifier(captchaRef.current);
  }, [])

  fb.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log('User is signed in.')
      props.updateUser(true)
      localStorage.setItem('user', 'true')
    } else {
      console.log('No user is signed in.')
      props.updateUser(false)
      localStorage.setItem('user', 'false')
    }
  })

  const onSignInSubmit = (e?: any) => {
    e.preventDefault()
    let phoneNumber = e.target.tel.value
    let appVerifier = window.recaptchaVerifier
    fb.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(function (confirmationResult) {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code)
      console.log('SMS sent')
      disablePhoneNumberForm(true)
      disableCodeForm(false)
      window.confirmationResult = confirmationResult
    }).catch(function (error) {
      // Error; SMS not sent
      console.log('No SMS, error: ' + error)
    })
  }

  const getCodeFromUserInput = (e: any) => {
    e.preventDefault()
    let code = e.target.code.value
    window.confirmationResult.confirm(code).then(function (result: { user: any }) {
      // User signed in successfully
      console.log('User signed in')
      let user = result.user
    }).catch(function (error: any) {
        // User couldn't sign in (bad verification code?)
        console.log('User could not sign in, error ' + error)
    })
  }

  const signOut = () => {
    fb.auth().signOut().then(function() {
      console.log('Sign-out successful.')
    }).catch(function(error) {
      console.log('An error happened.' + error)
    })
  }

  return (
    <div className='Auth Form'>
      <button id='specialBtn'><Link to='/'>×</Link></button>

      <div className={props.user ? 'disabled' : ''}>
        <form onSubmit={(e) => onSignInSubmit(e)}>
          <input type='tel' name='tel' ref={phoneNumberRef} placeholder='+7 (900) 000 00 00' />
          <div ref={captchaRef}></div>
          <button className={phoneNumberFormDisabled ? 'disabled' : ''} type='submit' value='submit'>Получить код</button>
        </form>

        <form className={codeFormDisabled ? 'disabled' : ''} onSubmit={(e) => getCodeFromUserInput(e)}>
          <label>Введите код из СМС</label>
          <input type='number' name='code' placeholder='Код' />
          <button type='submit' value='submit'>Готово</button>
        </form>
      </div>

      <div className={props.user ? '' : 'disabled'}>
        <button onClick={signOut}>Выйти</button>
      </div>
    </div>
  )
}

export default Auth
