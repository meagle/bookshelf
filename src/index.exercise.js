// 🐨 you'll need to import React and ReactDOM up here
import React, {useState, useRef} from 'react'

import ReactDOM from 'react-dom'

// 🐨 you'll also need to import the Logo component from './components/logo'
import {Logo} from './components/logo'
import {Dialog} from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import '@reach/dialog/styles.css'

const LoginForm = ({onSubmit}) => {
  const loginFormRef = useRef(null)

  /* 
  // This was my alternate but I think I like KCD's solution too (below)
  const handleSubmit = e => {
    e.preventDefault()
    const data = new FormData(loginFormRef.current)
    let object = {}
    data.forEach((value, key) => (object[key] = value))
    let json = JSON.stringify(object)
    onSubmit(json)
  }
  */

  function handleSubmit(event) {
    event.preventDefault()
    const {username, password} = event.target.elements
    console.log(event.target.elements)

    onSubmit({
      username: username.value,
      password: password.value,
    })
  }

  return (
    <form ref={loginFormRef} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">User Name:</label>
        <input type="text" name="username" id="username" />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" id="password" />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  )
}

const LoginModal = ({openModal, onClose}) => {
  function handleSubmit(formData) {
    console.log('login', formData)
    onClose()
  }

  const showDialog = openModal === 'login'

  return (
    <div>
      <Dialog isOpen={showDialog} aria-label="Login">
        <button className="close-button" onClick={() => onClose()}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>

        <LoginForm onSubmit={handleSubmit} buttonText="Login" />
      </Dialog>
    </div>
  )
}

const RegistrationModal = ({openModal, onClose}) => {
  const showDialog = openModal === 'register'

  return (
    <div>
      <Dialog isOpen={showDialog} aria-label="Register">
        <button className="close-button" onClick={() => onClose()}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
        <p>Register Modal</p>
      </Dialog>
    </div>
  )
}

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
const App = () => {
  const [openModal, setOpenModal] = useState('none')
  const onClose = () => {
    setOpenModal('none')
  }

  return (
    <div>
      <Logo width={80} height={80} />
      <h1>Bookshelf</h1>
      <div>
        <LoginModal openModal={openModal} onClose={onClose} />
        <RegistrationModal openModal={openModal} onClose={onClose} />
        <button onClick={() => setOpenModal('login')}>Login</button>
        <button onClick={() => setOpenModal('register')}>Register</button>
      </div>
    </div>
  )
}

const root = document.getElementById('root')
ReactDOM.render(<App />, root)
