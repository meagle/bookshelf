// 🐨 you'll need to import React and ReactDOM up here
import React, {useState} from 'react'

import ReactDOM from 'react-dom'

// 🐨 you'll also need to import the Logo component from './components/logo'
import {Logo} from './components/logo'
import {Dialog} from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'
import '@reach/dialog/styles.css'

const LoginModal = ({openModal, onClose}) => {
  const showDialog = openModal === 'login'
  return (
    <div>
      <Dialog isOpen={showDialog} aria-label="Login">
        <button className="close-button" onClick={() => onClose()}>
          <VisuallyHidden>Close</VisuallyHidden>
          <span aria-hidden>×</span>
        </button>
        <p>Login Modal</p>
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
      <div>Bookshelf</div>
      <Logo />
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
